import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import { updateSubmissionInSheets, deleteSubmissionFromSheets } from '@/lib/submissionSheets';

// GET - Fetch all submissions
export async function GET() {
  try {
    await dbConnect();

    const submissions = await Submission.find()
      .populate('registrationId', 'teamName teamBatch')
      .sort({ submittedAt: -1 });

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Error fetching submissions' },
      { status: 500 }
    );
  }
}

// PUT - Update submission in both database and Google Sheets
export async function PUT(req: NextRequest) {
  try {
    const { id, teamName, githubLink, googleDriveLink } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Submission ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the original submission data before updating
    const original = await Submission.findById(id);

    const updated = await Submission.findByIdAndUpdate(
      id,
      { teamName, githubLink, googleDriveLink },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update in Google Sheets
    try {
      if (updated.teamName && updated.githubLink && updated.googleDriveLink && updated.submittedAt) {
        await updateSubmissionInSheets({
          originalTeamName: original?.teamName, // Pass original team name to find the row
          teamName: updated.teamName,
          githubLink: updated.githubLink,
          googleDriveLink: updated.googleDriveLink,
          submittedAt: updated.submittedAt,
        });
        console.log('✅ Updated submission in both database and Google Sheets');
      }
    } catch (sheetsError) {
      console.error('⚠️ Failed to update Google Sheets:', sheetsError);
      // Continue even if sheets update fails
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully in database and sheets',
      submission: updated,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { message: 'Error updating submission' },
      { status: 500 }
    );
  }
}

// DELETE - Delete submission from both database and Google Sheets
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Submission ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get submission data before deleting
    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json(
        { message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await Submission.findByIdAndDelete(id);

    // Delete from Google Sheets
    try {
      if (submission.teamName) {
        await deleteSubmissionFromSheets(submission.teamName);
        console.log('✅ Deleted submission from both database and Google Sheets');
      }
    } catch (sheetsError) {
      console.error('⚠️ Failed to delete from Google Sheets:', sheetsError);
      // Continue even if sheets deletion fails
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully from database and sheets',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { message: 'Error deleting submission' },
      { status: 500 }
    );
  }
}
