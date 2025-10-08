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

    // Check team count (only count completed registrations)
    const teamCount = await Registration.countDocuments({ state: "DONE" });
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration closed: maximum of ${MAX_TEAMS} teams reached.` });
    }
    console.log(`✅ Team count: ${teamCount}/${MAX_TEAMS}`);

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
    
    const slotsRemaining = MAX_TEAMS - teamCount;
    return NextResponse.json({
      reply: `Team name saved as "${reg.teamName}". 🎉\n\n📊 ${slotsRemaining} slots remaining out of ${MAX_TEAMS} teams.\n\nNow enter your Hackerrank username. It should be "${reg.teamName}_CR" (team name can be any case, but _CR must be uppercase).`
    });
  }
  
  console.log("📋 Found existing registration, state:", reg.state);

  // Handle save edited data
  if (message === "SAVE_EDITED_DATA") {
    const { editedData } = body as any;

    if (!editedData) {
      return NextResponse.json({ reply: "❌ No edited data provided." }, { status: 400 });
    }

    // Update registration with edited data
    reg.teamName = editedData.teamName;
    reg.hackerrankUsername = editedData.hackerrankUsername;
    reg.teamBatch = editedData.teamBatch;
    reg.members = editedData.members.map((m: any) => ({
      fullName: m.fullName,
      indexNumber: m.indexNumber,
      batch: editedData.teamBatch, // All members have same batch
      email: m.email
    }));

    // Check if registration is complete (has all 4 members)
    const isComplete = reg.members.length === MEMBER_COUNT;

    if (isComplete) {
      // Complete registration
      reg.state = "DONE";
      await reg.save();

      // Save to Google Sheets
      try {
        const sheetsResult = await appendToGoogleSheets({
          teamName: reg.teamName || '',
          hackerrankUsername: reg.hackerrankUsername || '',
          teamBatch: reg.teamBatch || '',
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
      }

      return NextResponse.json({ reply: "🎉 Done! Your team is registered with updated details. You will receive a confirmation email shortly." });
    } else {
      // Continue registration - ask for next member
      reg.currentMember = reg.members.length + 1;
      reg.tempMember = undefined;
      await reg.save();

      const nextMemberLabel = reg.currentMember === 1 ? "Team Leader (Member 1)" : `Member ${reg.currentMember}`;
      return NextResponse.json({
        reply: `Details saved! Let's continue.\n\n${nextMemberLabel} — Full name:`
      });
    }
  }

  if (reg.state === "DONE") {
    return NextResponse.json({
      reply: "✅ This session has already completed registration.\n\nTo register another team, please click the 🔄 Reset button at the top of the chat."
    });
  }

  // If in CONFIRMATION state and receiving any message other than yes/no, provide guidance
  if (reg.state === "CONFIRMATION" && message && !["yes", "no"].includes(message.toLowerCase())) {
    return NextResponse.json({
      reply: "❌ Invalid input. Please type 'yes' to confirm or 'no' to edit details.\n\nIf you want to start a new registration, click the 🔄 Reset button."
    });
  }

  // MEMBER_DETAILS loop (collect exactly MEMBER_COUNT members)
  if (reg.state === "MEMBER_DETAILS") {
    if (!reg.currentMember) reg.currentMember = 1;
    if (!reg.teamBatch) {
      return NextResponse.json({ reply: "❌ Error: Team batch not set. Please restart registration." });
    }

    console.log("🔍 MEMBER_DETAILS state - tempMember:", JSON.stringify(reg.tempMember, null, 2));
    console.log("🔍 Current member:", reg.currentMember, "Message:", message);

    const memberLabel = reg.currentMember === 1 ? "Team Leader (Member 1)" : `Member ${reg.currentMember}`;

    // fullName
    if (!reg.tempMember) {
      if (!message) return NextResponse.json({ reply: `${memberLabel} — Full name:` });

      const trimmedMessage = message.trim();

      // Validate that name is not just numbers (prevent batch numbers being used as names)
      if (/^\d+$/.test(trimmedMessage)) {
        return NextResponse.json({
          reply: `❌ Invalid name. Full name cannot be just numbers.\n\n${memberLabel} — Full name:`
        });
      }

      // Validate name has at least 2 characters
      if (trimmedMessage.length < 2) {
        return NextResponse.json({
          reply: `❌ Name must be at least 2 characters.\n\n${memberLabel} — Full name:`
        });
      }

      reg.tempMember = { fullName: trimmedMessage, batch: reg.teamBatch };
      await reg.save();
      return NextResponse.json({ reply: `${memberLabel} — Index number (must start with ${reg.teamBatch}):` });
    }

    // indexNumber (validate against team batch)
    if (reg.tempMember && !reg.tempMember.indexNumber) {
      const trimmedMessage = message.trim().toUpperCase();
      if (!validators.index(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid index number. Must be 6 digits followed by a capital letter (e.g., 234001T)." });
      }

      // Validate that index number starts with the team batch
      const indexBatch = trimmedMessage.substring(0, 2);
      if (indexBatch !== reg.teamBatch) {
        return NextResponse.json({
          reply: `❌ Index number must start with your team batch ${reg.teamBatch}. You entered ${indexBatch}. Please enter a valid index number:`
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
      return NextResponse.json({ reply: `${memberLabel} — Email:` });
    }

    // email
    if (reg.tempMember && reg.tempMember.indexNumber && !reg.tempMember.email) {
      const trimmedMessage = message.trim();

      // Check for invalid characters like backslashes
      if (trimmedMessage.includes('\\') || trimmedMessage.includes('/')) {
        return NextResponse.json({ reply: "❌ Invalid email. Email cannot contain backslashes or forward slashes. Please enter a valid email address." });
      }

      if (!validators.email(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid email. Please enter a valid email address (e.g., name@example.com)." });
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
        const nextMemberLabel = `Member ${reg.currentMember}`;
        return NextResponse.json({
          reply: `${nextMemberLabel} — Full name:`
        });
      } else {
        reg.state = "CONFIRMATION";
        await reg.save();
        const summaryLines = [
          `Team: ${reg.teamName}`,
          `Hackerrank: ${reg.hackerrankUsername || "N/A"}`,
          `Batch: ${reg.teamBatch}`,
          `Members:`,
          ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.email}`),
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
      if (!reg.tempMember.indexNumber) {
        return NextResponse.json({ reply: `${memberLabel} — Index number (must start with ${reg.teamBatch}):` });
      } else if (!reg.tempMember.email) {
        return NextResponse.json({ reply: `${memberLabel} — Email:` });
      }
    } else {
      return NextResponse.json({ reply: `${memberLabel} — Full name:` });
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
    // move to batch selection
    reg.state = "BATCH_SELECTION";
    await reg.save();

    return NextResponse.json({
      reply: `Hackerrank username saved as "${reg.hackerrankUsername}".\n\nSelect your team's batch (all 4 members must be from the same batch):`,
      buttons: [
        { text: "Batch 23", value: "23" },
        { text: "Batch 24", value: "24" }
      ]
    });
  }

  // BATCH_SELECTION handling
  if (reg.state === "BATCH_SELECTION") {
    const trimmedMessage = message.trim();
    if (!validators.batch(trimmedMessage)) {
      return NextResponse.json({
        reply: "❌ Invalid batch. Please select Batch 23 or Batch 24:",
        buttons: [
          { text: "Batch 23", value: "23" },
          { text: "Batch 24", value: "24" }
        ]
      });
    }

    reg.teamBatch = trimmedMessage;
    reg.state = "MEMBER_DETAILS";
    reg.currentMember = 1;
    reg.tempMember = undefined;
    await reg.save();

    return NextResponse.json({
      reply: `Team batch saved as Batch ${reg.teamBatch}.\n\nTeam Leader (Member 1) — Full name:`
    });
  }

  // Handle CONFIRMATION state
  if (reg.state === "CONFIRMATION") {
    const trimmedMessage = message.trim().toLowerCase();

    if (!["yes", "no"].includes(trimmedMessage)) {
      return NextResponse.json({ reply: "❌ Invalid input. Please type 'yes' to confirm or 'no' to edit details." });
    }

    if (trimmedMessage === "no") {
      // User wants to edit - send edit form data with a button
      return NextResponse.json({
        reply: "Click the button below to edit your registration details:",
        buttons: [
          { text: "📝 Open Edit Form", value: "OPEN_EDIT_FORM" }
        ],
        showEditForm: true,
        registrationData: {
          teamName: reg.teamName,
          hackerrankUsername: reg.hackerrankUsername,
          teamBatch: reg.teamBatch,
          members: reg.members.map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email
          }))
        }
      });
    }

    // User said "yes" - show edit form popup to confirm before final submission
    if (trimmedMessage === "yes") {
      return NextResponse.json({
        reply: "Please review your details one final time before submission:",
        buttons: [
          { text: "📝 Review & Submit", value: "OPEN_EDIT_FORM" }
        ],
        showEditForm: true,
        registrationData: {
          teamName: reg.teamName,
          hackerrankUsername: reg.hackerrankUsername,
          teamBatch: reg.teamBatch,
          members: reg.members.map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email
          }))
        }
      });
    }
  } else {
    // generic validations for other states
    if (cfg.validate && !cfg.validate(message)) {
      return NextResponse.json({ reply: "❌ Invalid input. Please try again." });
    }

    if (cfg.save) cfg.save(reg, message);

    // advance state
    reg.state = cfg.next || reg.state;
    await reg.save();
  }

  // If we moved to CONFIRMATION, prepare summary
  if (reg.state === "CONFIRMATION") {
    const summaryLines = [
      `Team: ${reg.teamName}`,
      `Hackerrank: ${reg.hackerrankUsername || "N/A"}`,
      `Batch: ${reg.teamBatch}`,
      `Members:`,
      ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.email}`),
    ];
    const summary = summaryLines.join("\n");
    return NextResponse.json({ reply: `${summary}\n\n${states.CONFIRMATION.prompt}` });
  }

  // finalize on DONE
  if (reg.state === "DONE") {

    // final checks
    const teamCount = await Registration.countDocuments({ state: "DONE" });
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration failed: maximum of ${MAX_TEAMS} teams reached.` });
    }
    console.log(`✅ Finalizing registration. Team count: ${teamCount + 1}/${MAX_TEAMS}`);

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
        teamBatch: reg.teamBatch || '',
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