import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Issue from '@/models/Issue';

// GET - Fetch all issues
export async function GET() {
  try {
    await dbConnect();

    const issues = await Issue.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { message: 'Error fetching issues' },
      { status: 500 }
    );
  }
}

// PUT - Update issue status
export async function PUT(req: NextRequest) {
  try {
    const { id, status, adminNotes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Issue ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: {
      status?: string;
      adminNotes?: string;
      resolvedAt?: Date;
    } = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'resolved') updateData.resolvedAt = new Date();

    const updated = await Issue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Issue updated successfully',
      issue: updated,
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { message: 'Error updating issue' },
      { status: 500 }
    );
  }
}

// DELETE - Delete issue
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Issue ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Issue.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { message: 'Error deleting issue' },
      { status: 500 }
    );
  }
}
