import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";

export async function POST(req: Request) {
  try {
    console.log("🧪 Testing registration creation");
    await dbConnect();
    console.log("✅ DB connected for test");

    const { sessionId } = await req.json();
    console.log("📝 Test sessionId:", sessionId);

    // Try to create a minimal registration
    const reg = new Registration({ 
      sessionId: sessionId || "test-session", 
      state: "WELCOME", 
      members: [] 
    });
    
    console.log("💾 Attempting to save registration");
    await reg.save();
    console.log("✅ Registration saved successfully");

    return NextResponse.json({ 
      success: true, 
      registrationId: reg._id,
      state: reg.state 
    });
  } catch (error) {
    console.error("❌ Test registration error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : error
      },
      { status: 500 }
    );
  }
}