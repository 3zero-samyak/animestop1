import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    const errors: Record<string, string> = {};

    if (!name || name.length > 100) {
      errors.name = 'Please provide a valid name (up to 100 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 120) {
      errors.email = 'Please provide a valid email address (up to 120 characters).';
    }

    if (!subject || subject.length > 150) {
      errors.subject = 'Please provide a subject line (up to 150 characters).';
    }

    if (!message || message.length > 3000) {
      errors.message = 'Please provide a message body (up to 3000 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check if mail delivery or communications provider is configured
    const hasMailProvider = Boolean(
      process.env.CONTACT_EMAIL_RECIPIENT &&
      (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.SMTP_HOST)
    );

    if (!hasMailProvider) {
      return NextResponse.json({
        success: false,
        unavailable: true,
        message:
          'Online message routing is currently pending mail provider setup (requires SMTP_HOST or RESEND_API_KEY in server configuration). Your message text has been preserved.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by the AnimeStop team.',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to process contact form submission. Please try again.',
      },
      { status: 500 }
    );
  }
}

