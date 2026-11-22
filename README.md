# SupportFlow AI

**An AI-assisted customer support workspace for triaging, managing, and responding to customer tickets.**

SupportFlow AI is a portfolio SaaS prototype built to demonstrate AI-assisted product development, frontend engineering, backend integration, database design, workflow automation, and practical product thinking.

> **Current status:** UI and demo-mode ticket workflows are implemented. Supabase persistence is scaffolded and can be enabled after applying the SQL schema and configuring environment variables. Live LLM generation and end-to-end n8n delivery are integration steps, not claimed as complete in this starter.

## Product capabilities

- Support dashboard with ticket KPIs and a weekly volume chart
- Ticket inbox with search and status filtering
- Ticket details, status updates, and customer context
- Create-ticket workflow
- AI-assisted reply draft interaction (demo placeholder; not a live model call)
- Supabase schema for tickets, profiles, and ticket events
- n8n webhook starter for ticket-created notifications
- Responsive layout for desktop and mobile

## Tech stack

- React + TypeScript + Vite
- Supabase (PostgreSQL and Auth-ready schema)
- Recharts for dashboard visualization
- n8n for workflow automation
- Lucide icons

## Run locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/YOUR_USERNAME/supportflow-ai.git
cd supportflow-ai
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

The app runs in demo mode by default using seeded in-memory data. Changes are reset on page refresh.

## Enable Supabase persistence

1. Create a project at [Supabase](https://supabase.com/).
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the Project URL and anon/public key into `.env`.
4. Set `VITE_DEMO_MODE=false`.
5. Restart the Vite dev server.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_DEMO_MODE=false
```

**Important:** The current starter uses Supabase persistence for ticket insert and status update. It does not yet include the complete sign-in/sign-up screens or organization-level authorization. Do not expose service-role keys in frontend environment variables. Before real customer use, implement authentication, tenant-scoped RLS, role permissions, audit logging, and server-side validation.

## Import the n8n workflow

1. Open your n8n instance.
2. Choose **Import from File**.
3. Select `n8n/supportflow-ticket-notification.json`.
4. Activate the workflow and copy its Production Webhook URL.
5. Send a POST request with this payload:

```json
{
  "ticket_id": "SF-2051",
  "subject": "Delivery is delayed",
  "priority": "High",
  "customer": "Taylor Lee"
}
```

The starter validates and normalizes the payload. Add an email, Slack, or CRM node and configure credentials to deliver real notifications.

## Suggested next integrations

- Connect an LLM through a server-side endpoint (Supabase Edge Function or FastAPI); keep provider API keys out of the browser.
- Ground suggested replies in approved help-center content using RAG.
- Add authentication and organization membership.
- Add ticket assignment, comments, and event timeline.
- Connect the n8n webhook to ticket creation after adding a server-side integration endpoint.
- Add automated tests and deploy the frontend.

## Repository structure

```text
src/
  App.tsx                 Main dashboard and ticket workflows
  data.ts                 Demo ticket fixtures
  lib/supabase.ts         Supabase client configuration
  types.ts                Shared domain types
  styles.css              Responsive product styling
supabase/
  schema.sql              Database schema and starter RLS
n8n/
  supportflow-ticket-notification.json
```

## AI-assisted development workflow

This project is suitable for an iterative Vibe Coding workflow:

1. Use Lovable to explore product layout and UI directions.
2. Use Cursor to inspect generated code, implement domain logic, and refactor.
3. Review every generated change, run the app, and test key user flows.
4. Keep prompts, implementation decisions, and known limitations documented.

Only list AI coding tools in your portfolio that you actually used. Document the prompts and the changes you personally reviewed.

## Validation checklist

- [ ] `npm install`
- [ ] `npm run build`
- [ ] Create a ticket in demo mode
- [ ] Search and filter tickets
- [ ] Open a ticket and update its status
- [ ] Apply Supabase schema and verify persistence
- [ ] Import and test the n8n webhook
- [ ] Add a real server-side LLM integration
- [ ] Deploy and add a public demo URL

