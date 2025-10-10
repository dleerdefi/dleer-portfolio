import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting store (resets on server restart/redeploy)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Contact form API endpoint
 * Handles form submissions with multi-layer spam protection:
 * 1. Rate limiting (3 requests per 10 minutes per IP)
 * 2. Honeypot validation (hidden field must be empty)
 * 3. Time-based validation (reject submissions < 3 seconds)
 * 4. Server-side validation (email format, message length)
 * 5. Resend API integration for email delivery
 */
export async function POST(req: NextRequest) {
  try {
    // LAYER 1: Rate Limiting
    // Extract IP address from headers
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';

    const now = Date.now();
    const rateLimit = rateLimitStore.get(ip);

    // Check if IP is within rate limit window
    if (rateLimit && now < rateLimit.resetTime) {
      if (rateLimit.count >= 3) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      rateLimit.count++;
    } else {
      // New window or expired window - reset counter
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + 10 * 60 * 1000  // 10 minutes from now
      });
    }

    // Parse request body
    const body = await req.json();
    const { name, email, message, website, timestamp } = body;

    // LAYER 2: Honeypot Validation
    // If honeypot field has any value, it's a bot
    if (website && website.trim() !== '') {
      console.log('Honeypot triggered by IP:', ip);
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // LAYER 3: Time-Based Validation
    // Reject submissions that are too fast (< 3 seconds)
    const formRenderTime = new Date(timestamp).getTime();
    const submissionTime = Date.now();
    const timeDiff = submissionTime - formRenderTime;

    if (timeDiff < 3000) {  // Less than 3 seconds
      console.log('Submission too fast from IP:', ip, 'Time:', timeDiff, 'ms');
      return NextResponse.json(
        { error: 'Submission too fast. Please take your time.' },
        { status: 400 }
      );
    }

    // LAYER 4: Server-Side Validation
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // LAYER 5: Send Email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      // Use 'onboarding@resend.dev' for testing without custom domain
      // Replace with 'contact@yourdomain.com' after domain verification
      from: 'onboarding@resend.dev',
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
      replyTo: email,  // Allow direct reply to sender
      subject: `Portfolio Contact: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
              <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">From:</strong> ${name}</p>
                <p style="margin: 0;"><strong style="color: #667eea;">Email:</strong> <a href="mailto:${email}" style="color: #764ba2; text-decoration: none;">${email}</a></p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 5px;">
                <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">Message:</strong></p>
                <p style="margin: 0; white-space: pre-wrap; color: #555;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>

              <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                Sent from your portfolio contact form
              </p>
            </div>
          </body>
        </html>
      `
    });

    console.log('Email sent successfully:', result.data?.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact form error:', error);

    // Check if it's a Resend API error
    if (error instanceof Error) {
      // Log detailed error for debugging
      console.error('Error details:', error.message);

      // Return generic error to user (don't expose internal details)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 * Only needed if accessing from external domain
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
