import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Registration from '@/models/Registration';
import { updateInGoogleSheets, deleteFromGoogleSheets } from '@/lib/googleSheets';

// GET - Fetch all registrations
export async function GET() {
  try {
    await dbConnect();

    const registrations = await Registration.find({ state: 'DONE' })
      .select('teamName teamBatch members createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { message: 'Error fetching registrations' },
      { status: 500 }
    );
  }
}

// PUT - Update registration in both database and Google Sheets
export async function PUT(req: NextRequest) {
  try {
    const { id, teamName, teamBatch, members } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Registration ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the original registration data before updating
    const original = await Registration.findById(id);

    const updated = await Registration.findByIdAndUpdate(
      id,
      { teamName, teamBatch, members },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    // Update in Google Sheets
    try {
      if (updated.teamName && updated.teamBatch && updated.members && updated.createdAt) {
        await updateInGoogleSheets({
          originalTeamName: original?.teamName, // Pass original team name to find the row
          teamName: updated.teamName,
          teamBatch: updated.teamBatch,
          members: updated.members,
          timestamp: updated.createdAt,
        });
        console.log('✅ Updated in both database and Google Sheets');
      }
    } catch (sheetsError) {
      console.error('⚠️ Failed to update Google Sheets:', sheetsError);
      // Continue even if sheets update fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully in database and sheets',
      registration: updated,
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { message: 'Error updating registration' },
      { status: 500 }
    );
  }
}

// DELETE - Delete registration from both database and Google Sheets
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Registration ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get registration data before deleting
    const registration = await Registration.findById(id);

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await Registration.findByIdAndDelete(id);

    // Delete from Google Sheets
    let sheetsDeleted = false;
    let sheetsError = null;

    try {
      if (registration.teamName) {
        const result = await deleteFromGoogleSheets(registration.teamName);
        if (result.success) {
          sheetsDeleted = true;
          console.log('✅ Deleted from both database and Google Sheets');
        } else {
          sheetsError = result.error;
          console.error('⚠️ Failed to delete from Google Sheets:', result.error);
        }
      }
    } catch (error) {
      sheetsError = error instanceof Error ? error.message : 'Unknown error';
      console.error('⚠️ Failed to delete from Google Sheets:', error);
    }

    return NextResponse.json({
      success: true,
      message: sheetsDeleted
        ? 'Registration deleted successfully from database and Google Sheets'
        : 'Registration deleted from database only. Google Sheets error: ' + (sheetsError || 'Unknown'),
      sheetsDeleted,
      sheetsError: sheetsDeleted ? null : sheetsError,
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { message: 'Error deleting registration' },
      { status: 500 }
    );
  }
}
