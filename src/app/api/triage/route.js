import { NextResponse } from 'next/server';
import { triageEmails } from '@/lib/services/openai';
import { classifyEmail, suggestAction } from '@/lib/services/classifier';
import { saveTriagedEmails } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Please provide emails to triage' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Use rule-based classification
      const triaged = emails.map(email => {
        const classification = classifyEmail(email);
        return {
          id: email.id || Date.now().toString() + Math.random(),
          ...email,
          ...classification,
          summary: `${email.subject} - from ${email.from}`,
          suggestedAction: suggestAction(classification.priority, classification.category),
          draftReply: null,
          note: 'Rule-based classification - Add OPENAI_API_KEY for AI triage',
        };
      });

      const stats = {
        urgent: triaged.filter(e => e.priority === 'urgent').length,
        actionRequired: triaged.filter(e => e.priority === 'action-required').length,
        fyi: triaged.filter(e => e.priority === 'fyi').length,
        spam: triaged.filter(e => e.priority === 'spam').length,
      };

      const saved = await saveTriagedEmails(triaged);
      return NextResponse.json({ success: true, triaged, stats });
    }

    // Use AI triage
    const result = await triageEmails(emails);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to triage emails' },
        { status: 500 }
      );
    }

    // Merge triage results with original emails
    const triaged = result.triaged.map(t => {
      const original = emails.find(e => e.id === t.id);
      return { ...original, ...t };
    });

    await saveTriagedEmails(triaged);

    return NextResponse.json({
      success: true,
      triaged,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Triage error:', error);
    return NextResponse.json(
      { error: 'Failed to triage emails', details: error.message },
      { status: 500 }
    );
  }
}
