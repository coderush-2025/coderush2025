import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import mongoose from "mongoose";

interface TeamDetails {
  teamName: string;
  teamLeader?: string;
  batch?: string;
}

export async function GET() {
  try {
    console.log("🔍 Attempting to fetch teams...");
    await dbConnect();
    console.log("✅ Database connected");

    let teamNames: string[] = [];
    let teamDetails: TeamDetails[] = [];

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

      // Fetch only COMPLETED registrations (state: "DONE")
      const registrations = await Registration.find({
        teamName: { $exists: true, $ne: null },
        state: "DONE"
      })
        .select("teamName teamBatch members")
        .sort({ teamName: 1 })
        .lean();

      teamDetails = registrations
        .map((reg: { teamName?: string; teamBatch?: string; members?: Array<{ fullName?: string; batch?: string }> }) => ({
          teamName: reg.teamName || "",
          teamLeader: reg.members && reg.members.length > 0 ? reg.members[0].fullName : undefined,
          batch: reg.teamBatch || (reg.members && reg.members.length > 0 ? reg.members[0].batch : undefined)
        }))
        .filter((team) => team.teamName.trim() !== "");

      teamNames = teamDetails.map(team => team.teamName);
      console.log(`✅ Found ${teamNames.length} teams in Registration collection`);
    }

    console.log(`✅ Returning ${teamNames.length} team names`);

    return NextResponse.json({
      success: true,
      count: teamNames.length,
      teams: teamNames,
      teamDetails: teamDetails,
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
