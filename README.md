# Email Triage Agent

AI-powered email classification and priority sorting.

## Features

- 📧 Classify emails by category
- 🔴 Priority scoring (urgent/high/medium/low)
- 📝 Suggested reply drafts
- 🏷️ Auto-labeling and organization
- 📊 Inbox analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/triage` | Classify and prioritize email |
| POST | `/api/reply` | Generate reply draft |
| GET | `/api/emails` | Get processed emails |

## Demo Mode

Works without API key using keyword-based classification.

## License

MIT
