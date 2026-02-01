import { NextResponse } from 'next/server';
import { generateReply } from '@/lib/services/openai';

export async function POST(request) {
  try {
    const { email, tone = 'professional' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email data required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply: `Thank you for your email regarding "${email.subject}". I've received your message and will get back to you shortly.\n\nBest regards`,
        note: 'Demo mode - Add OPENAI_API_KEY for AI-generated replies',
      });
    }

    const reply = await generateReply(email, tone);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Generate reply error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply', details: error.message },
      { status: 500 }
    );
  }
}
