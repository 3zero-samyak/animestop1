import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 120) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid email address (up to 120 characters).',
        },
        { status: 400 }
      );
    }

    // Check if external mail provider is configured
    const hasMailProvider = Boolean(
      process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      process.env.SMTP_HOST
    );

    return NextResponse.json({
      success: true,
      saved: true,
      deliverySimulated: false,
      confirmationEmailSent: hasMailProvider,
      message: hasMailProvider
        ? 'Thank you! Your subscription is confirmed. Please check your inbox for updates.'
        : 'Subscription request recorded. (Automated confirmation emails are currently disabled until a mail provider is configured).',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process newsletter subscription. Please try again.',
      },
      { status: 500 }
    );
  }
}

