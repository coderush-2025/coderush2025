import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Issue from '@/models/Issue';

// POST - Create new issue report
export async function POST(req: NextRequest) {
  try {
    const { teamName, contactNumber, email, problemType, reason } = await req.json();

    // Validation
    if (!teamName || !contactNumber || !email || !problemType || !reason) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\s-()]+$/;
    if (!phoneRegex.test(contactNumber)) {
      return NextResponse.json(
        { message: 'Invalid contact number format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const issue = await Issue.create({
      teamName,
      contactNumber,
      email,
      problemType,
      reason,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Issue reported successfully. Our team will contact you soon.',
      issue,
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { message: 'Error submitting issue report' },
      { status: 500 }
    );
  }
}
