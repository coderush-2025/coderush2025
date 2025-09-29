import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";

export async function POST() {
  try {
    await dbConnect();
    
    console.log("🧹 Cleaning up duplicate registrations...");
    
    // Find all registrations without team names (incomplete registrations)
    const incompleteRegs = await Registration.find({
      $or: [
        { teamName: null },
        { teamName: undefined },
        { teamName: "" }
      ]
    });
    
    console.log(`Found ${incompleteRegs.length} incomplete registrations`);
    
    // Keep only the most recent incomplete registration per sessionId
    const sessionIds = [...new Set(incompleteRegs.map(reg => reg.sessionId))];
    let deletedCount = 0;
    
    for (const sessionId of sessionIds) {
      const sessionRegs = await Registration.find({ sessionId }).sort({ createdAt: -1 });
      if (sessionRegs.length > 1) {
        // Keep the most recent, delete the rest
        const toDelete = sessionRegs.slice(1);
        for (const reg of toDelete) {
          await Registration.deleteOne({ _id: reg._id });
          deletedCount++;
        }
      }
    }
    
    console.log(`Deleted ${deletedCount} duplicate registrations`);
    
    return NextResponse.json({
      success: true,
      message: `Cleanup complete. Deleted ${deletedCount} duplicate registrations.`,
      remaining: await Registration.countDocuments()
    });
    
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}