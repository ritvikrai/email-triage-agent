import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');
const RULES_FILE = path.join(DATA_DIR, 'rules.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Emails
export async function saveTriagedEmails(emails) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(EMAILS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { emails: [], stats: { processed: 0, urgent: 0, actionRequired: 0, archived: 0 } };
  }
  
  data.emails = [...emails, ...data.emails].slice(0, 500);
  data.stats.processed += emails.length;
  data.lastTriaged = new Date().toISOString();
  
  await fs.writeFile(EMAILS_FILE, JSON.stringify(data, null, 2));
  return data;
}

export async function getEmails(filter = {}) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(EMAILS_FILE, 'utf-8');
    const data = JSON.parse(file);
    let emails = data.emails;
    
    if (filter.priority) {
      emails = emails.filter(e => e.priority === filter.priority);
    }
    if (filter.category) {
      emails = emails.filter(e => e.category === filter.category);
    }
    
    return { emails, stats: data.stats };
  } catch (e) {
    return { emails: [], stats: {} };
  }
}

export async function updateEmailStatus(id, updates) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(EMAILS_FILE, 'utf-8');
    const data = JSON.parse(file);
    
    const email = data.emails.find(e => e.id === id);
    if (email) {
      Object.assign(email, updates, { updatedAt: new Date().toISOString() });
      await fs.writeFile(EMAILS_FILE, JSON.stringify(data, null, 2));
    }
    return email;
  } catch (e) {
    return null;
  }
}

// Custom rules
export async function getRules() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(RULES_FILE, 'utf-8');
    return JSON.parse(file).rules;
  } catch (e) {
    return [];
  }
}

export async function saveRule(rule) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(RULES_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { rules: [] };
  }
  
  data.rules.push({
    id: Date.now().toString(),
    ...rule,
    createdAt: new Date().toISOString(),
  });
  
  await fs.writeFile(RULES_FILE, JSON.stringify(data, null, 2));
  return data.rules;
}
