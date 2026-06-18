# Relay

> AI Executive Assistant for Gmail & Google Calendar

Relay is an AI-powered executive assistant that helps users manage emails, meetings, and daily workflows from a single workspace.

Built with Next.js, tRPC, Drizzle ORM, Google integrations, and AI agents, Relay combines inbox management, calendar automation, and conversational AI into one operating system.

---

## Features

### AI Assistant

* Summarize unread emails
* Draft professional replies
* Search inbox using natural language
* Prepare daily briefings
* Execute email and calendar actions through AI

### Gmail Integration

* View inbox messages
* Search emails
* Read email content
* Draft emails
* Send emails
* Archive emails
* Mark read/unread
* Delete emails

### Google Calendar Integration

* View upcoming events
* Create meetings
* Update calendar events
* Delete events
* Generate meeting briefs
* AI-powered scheduling assistance

### Modern Workspace

* AI Chat Interface
* Smart Inbox
* Calendar Dashboard
* Executive Briefings
* Connected Account Management

---

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion
* shadcn/ui
* Lucide Icons

### Backend

* tRPC
* Next.js Route Handlers
* Better Auth
* Google APIs

### Database

* Drizzle ORM
* PostgreSQL

### AI

* Google Gemini
* AI SDK
* Ollama (optional local models)

---

## Architecture

```text
┌───────────────────────┐
│      Relay UI         │
│ Chat • Inbox • Calendar│
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│        tRPC API       │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      AI Agent Layer   │
│ Gemini / Ollama       │
└───────┬───────┬───────┘
        │       │
        ▼       ▼
┌───────────┐ ┌───────────┐
│  Gmail    │ │ Calendar  │
└───────────┘ └───────────┘
        │
        ▼
┌───────────────────────┐
│      PostgreSQL       │
└───────────────────────┘
```

---

## Project Structure

```text
relay/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── api/
│   │   └── auth/
│   │
│   ├── components/
│   │   ├── chat/
│   │   ├── inbox/
│   │   ├── calendar/
│   │   └── ui/
│   │
│   ├── server/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── agent/
│   │   └── lib/
│   │
│   └── lib/
│
├── drizzle/
├── trpc/
└── public/
```

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/relay.git
cd relay
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

---

### 4. Run Database Migrations

```bash
pnpm db:push
```

or

```bash
pnpm drizzle-kit push
```

---

### 5. Start Development Server

```bash
pnpm dev
```

Application runs at:

```text
http://localhost:3000
```

---

## Available Commands

```bash
pnpm dev
pnpm build
pnpm start

pnpm lint
pnpm typecheck

pnpm db:push
pnpm db:studio
```

---

## AI Capabilities

Relay can:

* Summarize inboxes
* Generate daily briefings
* Draft email responses
* Create calendar events
* Prepare meeting notes
* Search emails using natural language
* Manage schedules through chat

Example:

```text
Summarize my unread emails

Create a meeting tomorrow at 10 AM

Find emails from Rahul

Prepare me for today's meetings

Draft a reply to the latest client email
```

---

## Deployment

Relay can be deployed on:

* Vercel
* Railway
* Render
* Fly.io

Ensure all environment variables and database connections are configured before deployment.

---

## Roadmap

* [ ] Real-time email synchronization
* [ ] AI meeting notes
* [ ] Voice assistant
* [ ] Slack integration
* [ ] Mobile application
* [ ] Multi-account support
* [ ] Team workspaces

---

## License

MIT License

---

Built with Next.js, tRPC, Drizzle, Google APIs, and AI SDK.
