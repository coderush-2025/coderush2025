import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { sessionId, forceDelete } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
    }

    // Find the registration for this session
    const reg = await Registration.findOne({ sessionId });

    // If forceDelete is true (from reset button), delete immediately
    if (forceDelete && reg && reg.state !== "DONE") {
      await Registration.deleteOne({ sessionId });
      console.log(`🗑️ Force deleted registration for session: ${sessionId}`);
      return NextResponse.json({
        success: true,
        deleted: true,
        message: "Registration deleted"
      });
    }

    // Otherwise, preserve incomplete registrations (don't delete on page refresh/navigation)
    if (reg && reg.state !== "DONE") {
      console.log(`✅ Preserving incomplete registration for session: ${sessionId}`);
      return NextResponse.json({
        success: true,
        deleted: false,
        message: "Incomplete registration preserved"
      });
    }

    // If no registration found or it's already completed, do nothing
    return NextResponse.json({
      success: true,
      deleted: false,
      message: reg ? "Registration already completed" : "No registration found"
    });

  } catch (error) {
    console.error("❌ Cleanup error:", error);
    return NextResponse.json(
      { success: false, error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
