import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import { states, validators, MEMBER_COUNT } from "@/lib/stateMachine";

type ReqBody = { sessionId: string; message: string };

const MAX_TEAMS = 100;
// allow letters/numbers/dot/underscore/hyphen before _CR, suffix required (case-insensitive)
const HR_USERNAME_REGEX = /^[A-Za-z0-9._-]+_CR$/i;

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
      reply: `Team name saved as "${reg.teamName}".\nNow enter your Hackerrank username. It must end with _CR (e.g., TeamName_CR).`
    });
  }
  
  console.log("📋 Found existing registration, state:", reg.state);

  if (reg.state === "DONE") {
    return NextResponse.json({ reply: "This session has already completed registration." });
  }

  // MEMBER_DETAILS loop (collect exactly MEMBER_COUNT members)
  if (reg.state === "MEMBER_DETAILS") {
    if (!reg.currentMember) reg.currentMember = 1;

    // fullName
    if (!reg.tempMember) {
      if (!message) return NextResponse.json({ reply: `Member ${reg.currentMember} — Full name:` });
      reg.tempMember = { fullName: message };
      await reg.save();
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Index number:` });
    }

    // indexNumber
    if (reg.tempMember && !reg.tempMember.indexNumber) {
      if (!validators.index(message)) {
        return NextResponse.json({ reply: "❌ Invalid index number. Please try again (e.g., IT2023/101)." });
      }
      reg.tempMember.indexNumber = message;
      await reg.save();
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Batch (e.g., 2023):` });
    }

    // batch
    if (reg.tempMember && reg.tempMember.indexNumber && !reg.tempMember.batch) {
      if (!validators.batch(message)) {
        return NextResponse.json({ reply: "❌ Invalid batch. Enter a 4-digit year, e.g., 2023." });
      }
      reg.tempMember.batch = message;
      await reg.save();
      return NextResponse.json({ reply: `Member ${reg.currentMember} — Email:` });
    }

    // email
    if (reg.tempMember && reg.tempMember.batch && !reg.tempMember.email) {
      if (!validators.email(message)) {
        return NextResponse.json({ reply: "❌ Invalid email. Please enter a valid email address." });
      }
      reg.tempMember.email = message;

      // push completed member
      reg.members.push(reg.tempMember as Required<typeof reg.tempMember>);
      reg.tempMember = undefined;
      await reg.save();

      if ((reg.members || []).length < MEMBER_COUNT) {
        reg.currentMember = (reg.currentMember || 1) + 1;
        await reg.save();
        return NextResponse.json({ reply: `Member ${reg.currentMember} — Full name:` });
      } else {
        reg.state = "CONSENT";
        await reg.save();
        return NextResponse.json({ reply: states.CONSENT.prompt });
      }
    }
  }

  // handle other states
  const cfg = states[reg.state];
  if (!cfg) return NextResponse.json({ reply: "Invalid state. Please start again." });

  // HACKERRANK handling: must end with _CR
  if (reg.state === "HACKERRANK") {
    if (!message) {
      return NextResponse.json({ reply: "Please enter your Hackerrank username (must end with _CR)." });
    }

    if (!HR_USERNAME_REGEX.test(message)) {
      return NextResponse.json({
        reply:
          `❌ Invalid Hackerrank username. It must end with _CR and contain only letters, numbers, dot, underscore, or hyphen before the suffix.\n` +
          `Example valid: TeamName_CR or team123_CR\nPlease re-enter the username.`,
      });
    }

    // Optional: check hackerrank username uniqueness among existing registrations
    const hrExists = await Registration.findOne({ hackerrankUsername: { $regex: `^${escapeRegExp(message)}$`, $options: "i" } });
    if (hrExists) {
      return NextResponse.json({ reply: "❌ That Hackerrank username is already used. Please contact organizers or choose another team name." });
    }

    // Save entered username (preserve user case)
    reg.hackerrankUsername = message;
    // move to members collection
    reg.state = "MEMBER_DETAILS";
    reg.currentMember = 1;
    reg.tempMember = undefined;
    await reg.save();

    return NextResponse.json({ reply: `Hackerrank username saved as "${reg.hackerrankUsername}".\nMember 1 — Full name:` });
  }

  // generic validations (CONSENT, CONFIRMATION)
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
    if (!reg.consent) {
      return NextResponse.json({ reply: "You must accept the rules to complete registration." });
    }

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