import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import Submission from "@/models/Submission";
import { appendSubmissionToSheets } from "@/lib/submissionSheets";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { teamName, githubLink, googleDriveLink } = body;

    // Validate required fields
    if (!teamName || !githubLink || !googleDriveLink) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Trim and validate team name
    const trimmedTeamName = teamName.trim();
    if (trimmedTeamName.length < 3) {
      return NextResponse.json(
        { success: false, error: "Team name must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Validate URLs
    try {
      new URL(githubLink);
      new URL(googleDriveLink);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format for GitHub or Google Drive link" },
        { status: 400 }
      );
    }

    // Validate GitHub URL
    if (!githubLink.includes('github.com')) {
      return NextResponse.json(
        { success: false, error: "GitHub link must be a valid github.com URL" },
        { status: 400 }
      );
    }

    // Validate Google Drive URL
    if (!googleDriveLink.includes('drive.google.com')) {
      return NextResponse.json(
        { success: false, error: "Google Drive link must be a valid drive.google.com URL" },
        { status: 400 }
      );
    }

    // Check if team is registered
    const registration = await Registration.findOne({
      teamName: { $regex: `^${escapeRegExp(trimmedTeamName)}$`, $options: "i" },
      state: "DONE"
    });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: `Team "${trimmedTeamName}" is not registered. Only registered teams can submit.`
        },
        { status: 403 }
      );
    }

    // Check if team already submitted
    const existingSubmission = await Submission.findOne({
      teamName: { $regex: `^${escapeRegExp(trimmedTeamName)}$`, $options: "i" }
    });

    let submission;
    let isUpdate = false;

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.githubLink = githubLink.trim();
      existingSubmission.googleDriveLink = googleDriveLink.trim();
      existingSubmission.submittedAt = new Date();
      submission = await existingSubmission.save();
      isUpdate = true;
      console.log('📝 Updated submission for team:', trimmedTeamName);
    } else {
      // Create new submission
      submission = new Submission({
        teamName: registration.teamName, // Use exact team name from registration
        githubLink: githubLink.trim(),
        googleDriveLink: googleDriveLink.trim(),
        registrationId: registration._id,
        submittedAt: new Date(),
      });
      await submission.save();
      console.log('✅ Created new submission for team:', trimmedTeamName);
    }

    // Save to Google Sheets
    try {
      const sheetsResult = await appendSubmissionToSheets({
        teamName: submission.teamName,
        githubLink: submission.githubLink,
        googleDriveLink: submission.googleDriveLink,
        submittedAt: submission.submittedAt,
      });

      if (sheetsResult.success) {
        console.log('✅ Submission saved to Google Sheets');
      } else {
        console.error('⚠️ Failed to save to Google Sheets:', sheetsResult.error);
      }
    } catch (sheetsError) {
      console.error('⚠️ Google Sheets error (non-blocking):', sheetsError);
    }

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? `Submission updated successfully for team "${submission.teamName}"! ✅`
        : `Submission received successfully for team "${submission.teamName}"! ✅`,
      data: {
        teamName: submission.teamName,
        githubLink: submission.githubLink,
        googleDriveLink: submission.googleDriveLink,
        submittedAt: submission.submittedAt,
      },
    });

  } catch (error) {
    console.error("❌ Submission API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while processing your submission. Please try again."
      },
      { status: 500 }
    );
  }
}

// Helper function to escape regex special characters
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
