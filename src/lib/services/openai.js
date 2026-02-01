import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function triageEmails(emails) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert email triage assistant. Analyze emails and categorize them by priority and type.

Categories:
- urgent: Requires immediate attention (deadlines, critical issues)
- action-required: Needs a response or action but not urgent
- fyi: Informational, no action needed
- spam: Promotional or unwanted
- personal: Personal/non-work related

Return JSON:
{
  "triaged": [
    {
      "id": "email id",
      "priority": "urgent/action-required/fyi/spam/personal",
      "category": "work/personal/newsletter/promotion/notification",
      "summary": "1-2 sentence summary",
      "suggestedAction": "reply/archive/delegate/schedule/delete",
      "draftReply": "if reply suggested, draft a response",
      "deadline": "if any deadline mentioned",
      "sentiment": "positive/neutral/negative/urgent"
    }
  ],
  "stats": {
    "urgent": 0,
    "actionRequired": 0,
    "fyi": 0,
    "spam": 0
  }
}`,
      },
      {
        role: 'user',
        content: `Triage these emails:\n${JSON.stringify(emails.map(e => ({
          id: e.id,
          from: e.from,
          subject: e.subject,
          preview: e.body?.substring(0, 500) || e.snippet,
          date: e.date,
        })), null, 2)}`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse triage:', e);
  }
  
  return null;
}

export async function generateReply(email, tone = 'professional') {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Generate a ${tone} email reply. Be concise and clear. Return just the reply text.`,
      },
      {
        role: 'user',
        content: `Original email from ${email.from}:\nSubject: ${email.subject}\n\n${email.body}\n\nGenerate a helpful reply.`,
      },
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}

export async function summarizeThread(emails) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Summarize email threads concisely. Highlight key points, decisions, and any pending actions.',
      },
      {
        role: 'user',
        content: `Summarize this email thread:\n${emails.map(e => `From: ${e.from}\nDate: ${e.date}\n${e.body}`).join('\n\n---\n\n')}`,
      },
    ],
    max_tokens: 400,
  });

  return response.choices[0].message.content;
}
