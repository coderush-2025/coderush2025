import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import { states } from "@/lib/stateMachine";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
    }

    // Find the registration for this session
    const reg = await Registration.findOne({ sessionId });

    // If no registration exists, return initial state
    if (!reg) {
      return NextResponse.json({
        success: true,
        exists: false,
        initialMessage: "👋 Hi! I'll register your team for CodeRush 2025. What's your team name?"
      });
    }

    // If registration is complete
    if (reg.state === "DONE") {
      return NextResponse.json({
        success: true,
        exists: true,
        state: "DONE",
        message: "✅ This registration has already been submitted.",
        buttons: [
          { text: "📝 Edit Details", value: "edit" },
          { text: "🔄 Reset & Register New Team", value: "RESET" }
        ],
        data: {
          teamName: reg.teamName,
          teamBatch: reg.teamBatch,
          members: reg.members
        }
      });
    }

    // If registration is in progress, provide the appropriate next prompt
    let message = "";
    let buttons = undefined;

    switch (reg.state) {
      case "BATCH_SELECTION":
        message = `Welcome back! Your team "${reg.teamName}" is saved.\n\nSelect your team's batch (all 4 members must be from the same batch):`;
        buttons = [
          { text: "Batch 23", value: "23" },
          { text: "Batch 24", value: "24" }
        ];
        break;

      case "MEMBER_DETAILS":
        const currentMemberNum = reg.currentMember || 1;
        const memberLabel = currentMemberNum === 1 ? "Team Leader (Member 1)" : `Member ${currentMemberNum}`;

        if (!reg.tempMember) {
          message = `Welcome back! Your team "${reg.teamName}" (Batch ${reg.teamBatch}) is saved.\n\n${reg.members.length > 0 ? `You've registered ${reg.members.length} member(s) so far.\n\n` : ""}${memberLabel} — Full name:`;
        } else if (!reg.tempMember.indexNumber) {
          message = `Welcome back! Continuing with ${memberLabel}.\n\n${memberLabel} — Index number (must start with ${reg.teamBatch}):`;
        } else if (!reg.tempMember.email) {
          message = `Welcome back! Continuing with ${memberLabel}.\n\n${memberLabel} — Email:`;
        }
        break;

      case "CONFIRMATION":
        const summaryLines = [
          `Welcome back! Here's your registration summary:`,
          ``,
          `Team: ${reg.teamName}`,
          `Batch: ${reg.teamBatch}`,
          `Members:`,
          ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.email}`),
        ];
        message = summaryLines.join("\n") + "\n\n" + states.CONFIRMATION.prompt;
        break;

      default:
        message = `Welcome back! Continue your registration.`;
    }

    return NextResponse.json({
      success: true,
      exists: true,
      state: reg.state,
      message,
      buttons,
      data: {
        teamName: reg.teamName,
        teamBatch: reg.teamBatch,
        members: reg.members,
        currentMember: reg.currentMember
      }
    });

  } catch (error) {
    console.error("❌ Session fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Session fetch failed" },
      { status: 500 }
    );
  }
}
