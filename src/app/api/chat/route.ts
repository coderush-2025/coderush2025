import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import { states, validators, MEMBER_COUNT } from "@/lib/stateMachine";
import { appendToGoogleSheets } from "@/lib/googleSheets";

type ReqBody = { sessionId: string; message: string };

const MAX_TEAMS = 100;
// HackerRank username validation is now done with custom logic

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: Request) {
  try {
    console.log("🚀 Starting chat API request");
    await dbConnect();
    console.log("✅ Database connected");
    
    let body: ReqBody;
    try {
      body = await req.json();
      console.log("📝 Request body parsed:", { sessionId: body.sessionId, message: body.message?.substring(0, 50) });
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json({ reply: "Invalid request format" }, { status: 400 });
    }
    
    const sessionId = body.sessionId;
    const message = (body.message || "").trim();

    if (!sessionId) {
      console.error("❌ Missing sessionId");
      return NextResponse.json({ reply: "Missing sessionId" }, { status: 400 });
    }

  // find or create session
  console.log("🔍 Looking for registration with sessionId:", sessionId);
  let reg = await Registration.findOne({ sessionId });
  if (!reg) {
    console.log("✨ Creating new registration with team name");
    // First message should be the team name
    if (!message || message.trim().length <= 2) {
      return NextResponse.json({ reply: "❌ Team name must be at least 3 characters. Try again." });
    }

    // Check team count
    const teamCount = await Registration.countDocuments({});
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration closed: maximum of ${MAX_TEAMS} teams reached.` });
    }

    // Check uniqueness (case-insensitive)
    const exists = await Registration.findOne({ teamName: { $regex: `^${escapeRegExp(message)}$`, $options: "i" } });
    if (exists) {
      return NextResponse.json({ reply: "❌ Team name already taken. Please choose another team name." });
    }

    // Create registration with team name
    reg = new Registration({ 
      sessionId, 
      state: "HACKERRANK", 
      teamName: message.trim(),
      members: [] 
    });
    await reg.save();
    console.log("💾 New registration saved with team name:", reg.teamName);
    
    return NextResponse.json({
      reply: `Team name saved as "${reg.teamName}".\nNow enter your Hackerrank username. It should be "${reg.teamName}_CR" (team name can be any case, but _CR must be uppercase).`
    });
  }
  
  console.log("📋 Found existing registration, state:", reg.state);

  if (reg.state === "DONE") {
    return NextResponse.json({ reply: "This session has already completed registration." });
  }

  // MEMBER_DETAILS loop (collect exactly MEMBER_COUNT members)
  if (reg.state === "MEMBER_DETAILS") {
    if (!reg.currentMember) reg.currentMember = 1;

    console.log("🔍 MEMBER_DETAILS state - tempMember:", JSON.stringify(reg.tempMember, null, 2));
    console.log("🔍 Current member:", reg.currentMember, "Message:", message);

    // fullName
    if (!reg.tempMember) {
      if (!message) return NextResponse.json({ reply: `Member ${reg.currentMember} — Full name:` });
      reg.tempMember = { fullName: message };
      await reg.save();
      // After full name, ask for batch selection
      return NextResponse.json({ 
        reply: `Member ${reg.currentMember} — Select your batch:`,
        buttons: [
          { text: "Batch 22", value: "22" },
          { text: "Batch 23", value: "23" },
          { text: "Batch 24", value: "24" }
        ]
      });
    }

    // batch selection (ask first)
    if (reg.tempMember && !reg.tempMember.batch) {
      if (!message) {
        return NextResponse.json({ 
          reply: `Member ${reg.currentMember} — Select your batch:`,
          buttons: [
            { text: "Batch 22", value: "22" },
            { text: "Batch 23", value: "23" },
            { text: "Batch 24", value: "24" }
          ]
        });
      }
      
      const trimmedMessage = message.trim();
      if (!validators.batch(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid batch. Must be exactly 2 digits (e.g., 22, 23, 24). Please select again:" });
      }
      
      // Create a new tempMember object to ensure proper MongoDB update
      reg.tempMember = {
        ...reg.tempMember,
        batch: trimmedMessage
      };
      
      // Mark the field as modified for mongoose
      reg.markModified('tempMember');
      await reg.save();
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Index number (must start with ${trimmedMessage}):` });
    }

    // indexNumber (validate against selected batch)
    if (reg.tempMember && reg.tempMember.batch && !reg.tempMember.indexNumber) {
      const trimmedMessage = message.trim().toUpperCase();
      if (!validators.index(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid index number. Must be 6 digits followed by a capital letter (e.g., 224001T)." });
      }
      
      // Validate that index number starts with the selected batch
      const indexBatch = trimmedMessage.substring(0, 2);
      if (indexBatch !== reg.tempMember.batch) {
        return NextResponse.json({ 
          reply: `❌ Index number must start with your selected batch ${reg.tempMember.batch}. You entered ${indexBatch}. Please enter a valid index number:` 
        });
      }
      
      // Create a new tempMember object to ensure proper MongoDB update
      reg.tempMember = {
        ...reg.tempMember,
        indexNumber: trimmedMessage
      };
      
      // Mark the field as modified for mongoose
      reg.markModified('tempMember');
      await reg.save();
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Email:` });
    }

    // email
    if (reg.tempMember && reg.tempMember.batch && !reg.tempMember.email) {
      const trimmedMessage = message.trim();
      if (!validators.email(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid email. Please enter a valid email address." });
      }
      
      // Create a new tempMember object to ensure proper MongoDB update
      reg.tempMember = {
        ...reg.tempMember,
        email: trimmedMessage
      };

      // push completed member
      reg.members.push(reg.tempMember as Required<typeof reg.tempMember>);
      reg.tempMember = undefined;
      
      // Mark the fields as modified for mongoose
      reg.markModified('members');
      reg.markModified('tempMember');
      await reg.save();

      if ((reg.members || []).length < MEMBER_COUNT) {
        reg.currentMember = (reg.currentMember || 1) + 1;
        await reg.save();
        return NextResponse.json({ reply: `Member ${reg.currentMember} — Full name:` });
      } else {
        reg.state = "CONFIRMATION";
        await reg.save();
        const summaryLines = [
          `Team: ${reg.teamName}`,
          `Hackerrank: ${reg.hackerrankUsername || "N/A"}`,
          `Members:`,
          ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.batch} — ${m.email}`),
        ];
        const summary = summaryLines.join("\n");
        return NextResponse.json({ reply: `${summary}\n\n${states.CONFIRMATION.prompt}` });
      }
    }

    // Fallback case - this shouldn't happen but provides debugging info
    console.log("⚠️ Unexpected MEMBER_DETAILS state:", {
      hasTempMember: !!reg.tempMember,
      tempMember: reg.tempMember,
      currentMember: reg.currentMember
    });
    
    // Determine what to ask for based on current state
    if (reg.tempMember) {
      if (!reg.tempMember.batch) {
        return NextResponse.json({ 
          reply: `Member ${reg.currentMember} — Select your batch:`,
          buttons: [
            { text: "Batch 22", value: "22" },
            { text: "Batch 23", value: "23" },
            { text: "Batch 24", value: "24" }
          ]
        });
      } else if (!reg.tempMember.indexNumber) {
        return NextResponse.json({ reply: `Member ${reg.currentMember} — Index number (must start with ${reg.tempMember.batch}):` });
      } else if (!reg.tempMember.email) {
        return NextResponse.json({ reply: `Member ${reg.currentMember} — Email:` });
      }
    } else {
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Full name:` });
    }
  }

  // handle other states
  const cfg = states[reg.state];
  if (!cfg) return NextResponse.json({ reply: "Invalid state. Please start again." });

  // HACKERRANK handling: must be teamname_CR (team name case insensitive, _CR case sensitive)
  if (reg.state === "HACKERRANK") {
    if (!reg.teamName) {
      return NextResponse.json({ reply: "❌ Error: Team name not found. Please restart registration." });
    }

    if (!message) {
      return NextResponse.json({ reply: `Please enter your Hackerrank username. It should be "${reg.teamName}_CR" (team name can be any case, but _CR must be uppercase).` });
    }

    const trimmedMessage = message.trim();
    
    // Check if it ends with _CR (case sensitive)
    if (!trimmedMessage.endsWith('_CR')) {
      return NextResponse.json({
        reply:
          `❌ Invalid Hackerrank username. It must end with _CR (uppercase).\n` +
          `Examples: "${reg.teamName}_CR", "${reg.teamName.toLowerCase()}_CR", "${reg.teamName.toUpperCase()}_CR"\nPlease re-enter the username.`,
      });
    }

    // Extract the team name part (everything before _CR)
    const usernameTeamPart = trimmedMessage.slice(0, -3); // Remove '_CR' from end
    
    // Check if the team name part matches (case insensitive)
    if (usernameTeamPart.toLowerCase() !== reg.teamName.toLowerCase()) {
      return NextResponse.json({
        reply:
          `❌ Hackerrank username should start with your team name.\n` +
          `Your team name is "${reg.teamName}". Valid examples:\n` +
          `• "${reg.teamName}_CR"\n` +
          `• "${reg.teamName.toLowerCase()}_CR"\n` +
          `• "${reg.teamName.toUpperCase()}_CR"\n` +
          `Please re-enter the correct username.`,
      });
    }

    // Optional: check hackerrank username uniqueness among existing registrations
    const hrExists = await Registration.findOne({ hackerrankUsername: { $regex: `^${escapeRegExp(trimmedMessage)}$`, $options: "i" } });
    if (hrExists) {
      return NextResponse.json({ reply: "❌ That Hackerrank username is already used. Please contact organizers or choose another team name." });
    }

    // Save entered username (preserve user case)
    reg.hackerrankUsername = trimmedMessage;
    // move to members collection
    reg.state = "MEMBER_DETAILS";
    reg.currentMember = 1;
    reg.tempMember = undefined;
    await reg.save();

    return NextResponse.json({ reply: `Hackerrank username saved as "${reg.hackerrankUsername}".\nMember 1 — Full name:` });
  }

  // generic validations (CONFIRMATION)
  if (cfg.validate && !cfg.validate(message)) {
    return NextResponse.json({ reply: "❌ Invalid input. Please try again." });
  }

  if (cfg.save) cfg.save(reg, message);

  // advance state
  reg.state = cfg.next || reg.state;
  await reg.save();

  // If we moved to CONFIRMATION, prepare summary
  if (reg.state === "CONFIRMATION") {
    const summaryLines = [
      `Team: ${reg.teamName}`,
      `Hackerrank: ${reg.hackerrankUsername || "N/A"}`,
      `Members:`,
      ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.batch} — ${m.email}`),
    ];
    const summary = summaryLines.join("\n");
    return NextResponse.json({ reply: `${summary}\n\n${states.CONFIRMATION.prompt}` });
  }

  // finalize on DONE
  if (reg.state === "DONE") {

    // final checks
    const teamCount = await Registration.countDocuments({});
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration failed: maximum of ${MAX_TEAMS} teams reached.` });
    }

    const exists = await Registration.findOne({ teamName: { $regex: `^${escapeRegExp(reg.teamName || "")}$`, $options: "i" }, _id: { $ne: reg._id } });
    if (exists) {
      return NextResponse.json({ reply: "❌ Team name conflict detected. Please restart and choose another team name." });
    }

    await reg.save();

    // Save to Google Sheets
    try {
      const sheetsResult = await appendToGoogleSheets({
        teamName: reg.teamName || '',
        hackerrankUsername: reg.hackerrankUsername || '',
        members: reg.members || [],
        timestamp: new Date(),
      });
      
      if (sheetsResult.success) {
        console.log('✅ Registration saved to Google Sheets');
      } else {
        console.error('⚠️ Failed to save to Google Sheets:', sheetsResult.error);
      }
    } catch (sheetsError) {
      console.error('⚠️ Google Sheets error (non-blocking):', sheetsError);
      // Don't fail the registration if Google Sheets fails
    }

    // Optionally send confirmation email here

    return NextResponse.json({ reply: states.DONE.prompt });
  }

  // default fallback prompt
  return NextResponse.json({ reply: states[reg.state]?.prompt || "Okay." });
  
  } catch (error) {
    console.error("❌ API error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { reply: "Sorry, there was an error processing your request. Please try again." },
      { status: 500 }
    );
  }
}