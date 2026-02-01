// Email classification rules (for when AI is unavailable)
export const CLASSIFICATION_RULES = {
  urgent: {
    subjectKeywords: ['urgent', 'asap', 'emergency', 'critical', 'deadline', 'immediately', 'action required'],
    fromDomains: [], // Add important domains
    bodyKeywords: ['by end of day', 'respond immediately', 'time sensitive'],
  },
  spam: {
    subjectKeywords: ['unsubscribe', 'sale', 'discount', 'offer', 'free', 'winner', 'congratulations'],
    fromPatterns: ['noreply', 'marketing', 'promo', 'newsletter'],
    bodyKeywords: ['unsubscribe', 'opt out', 'special offer'],
  },
  newsletter: {
    subjectKeywords: ['newsletter', 'digest', 'weekly', 'monthly', 'roundup'],
    fromPatterns: ['news', 'digest', 'updates'],
  },
  notification: {
    fromPatterns: ['notification', 'alert', 'no-reply'],
    subjectKeywords: ['notification', 'alert', 'update', 'confirmation'],
  },
};

export function classifyEmail(email) {
  const subject = (email.subject || '').toLowerCase();
  const from = (email.from || '').toLowerCase();
  const body = (email.body || email.snippet || '').toLowerCase();

  // Check urgent
  for (const keyword of CLASSIFICATION_RULES.urgent.subjectKeywords) {
    if (subject.includes(keyword)) {
      return { priority: 'urgent', category: 'work', confidence: 0.8 };
    }
  }

  // Check spam
  for (const keyword of CLASSIFICATION_RULES.spam.subjectKeywords) {
    if (subject.includes(keyword)) {
      return { priority: 'spam', category: 'promotion', confidence: 0.7 };
    }
  }
  for (const pattern of CLASSIFICATION_RULES.spam.fromPatterns) {
    if (from.includes(pattern)) {
      return { priority: 'spam', category: 'promotion', confidence: 0.6 };
    }
  }

  // Check newsletter
  for (const keyword of CLASSIFICATION_RULES.newsletter.subjectKeywords) {
    if (subject.includes(keyword)) {
      return { priority: 'fyi', category: 'newsletter', confidence: 0.7 };
    }
  }

  // Check notification
  for (const pattern of CLASSIFICATION_RULES.notification.fromPatterns) {
    if (from.includes(pattern)) {
      return { priority: 'fyi', category: 'notification', confidence: 0.6 };
    }
  }

  // Default
  return { priority: 'action-required', category: 'work', confidence: 0.5 };
}

export function suggestAction(priority, category) {
  const actions = {
    urgent: 'reply',
    'action-required': 'reply',
    fyi: 'archive',
    spam: 'delete',
    personal: 'reply',
  };
  
  return actions[priority] || 'archive';
}
