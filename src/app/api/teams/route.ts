import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import mongoose from "mongoose";

export async function GET() {
  try {
    console.log("🔍 Attempting to fetch teams...");
    await dbConnect();
    console.log("✅ Database connected");

    let teamNames: string[] = [];

    // First, try to fetch from a "teams" collection if it exists
    try {
      if (mongoose.connection.db) {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const hasTeamsCollection = collections.some(
          (col) => col.name === "teams"
        );

        if (hasTeamsCollection) {
          console.log("📊 Found 'teams' collection, fetching from it...");
          const teamsCollection = db.collection("teams");
          const teams = await teamsCollection
            .find({})
            .project({ teamName: 1, _id: 0 })
            .toArray();
          teamNames = teams
            .map((team: { teamName?: string }) => team.teamName)
            .filter((name): name is string => !!name);
          console.log(`✅ Found ${teamNames.length} teams in 'teams' collection`);
        }
      }
    } catch (collectionErr) {
      console.log("⚠️ Could not access 'teams' collection, trying registrations...", collectionErr);
    }

    // If no teams found in "teams" collection, fetch from Registration model
    if (teamNames.length === 0) {
      console.log("📊 Fetching from Registration collection...");
      
      // Fetch all registrations that have a teamName
      // Option 1: Get all teams with a teamName (current)
      const registrations = await Registration.find({
        teamName: { $exists: true, $ne: null }
      })
        .select("teamName")
        .sort({ teamName: 1 })
        .lean();

      // Option 2: Uncomment below to show only COMPLETED registrations
      // const registrations = await Registration.find({
      //   teamName: { $exists: true, $ne: null },
      //   state: "DONE"
      // })
      //   .select("teamName")
      //   .sort({ teamName: 1 })
      //   .lean();

      teamNames = registrations
        .map((reg: { teamName?: string }) => reg.teamName)
        .filter((name): name is string => !!name && name.trim() !== "");
      console.log(`✅ Found ${teamNames.length} teams in Registration collection`);
    }

    console.log(`✅ Returning ${teamNames.length} team names`);

    return NextResponse.json({
      success: true,
      count: teamNames.length,
      teams: teamNames,
    });
  } catch (error) {
    console.error("❌ Error fetching teams:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch teams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
