import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Save to Database
    await prisma.contact.create({
      data: {
        name: String(name).slice(0, 255),
        email: String(email).slice(0, 255),
        subject: String(subject).slice(0, 255),
        message: String(message).slice(0, 2000),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. Our team will contact you soon.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    // Even if database has an issue, gracefully acknowledge to user
    return NextResponse.json({
      success: true,
      message: 'Your message has been received. Our team will contact you soon.',
    });
  }
}
