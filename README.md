# SupportFlow AI

**An AI-assisted customer support workspace for managing tickets, streamlining support operations, and exploring AI-powered customer service workflows.**

SupportFlow AI is a portfolio SaaS prototype designed to demonstrate practical product development, AI-assisted coding, frontend engineering, database integration, and business workflow automation. It provides a modern workspace for managing customer support tickets, monitoring support activity, and preparing AI-assisted responses.

## Key Features

- **Support Dashboard:** Overview of support activity, ticket statistics, KPIs, and weekly ticket volume.
- **Ticket Management:** Create, search, filter, view, and update customer support tickets.
- **Ticket Details:** Access ticket information, status, priority, and customer context.
- **AI-Assisted Replies:** Interactive reply-drafting interface demonstrating the intended AI-assisted support workflow.
- **Database Integration:** Supabase schema for tickets, customer profiles, and ticket events.
- **Workflow Automation:** n8n webhook starter for processing ticket-created notifications.
- **Responsive Interface:** Modern dashboard optimized for desktop and mobile devices.

## Technology Stack

- React
- TypeScript
- Vite
- Supabase (PostgreSQL)
- Recharts
- n8n
- Lucide Icons

## Project Architecture

The application is organized around three main components:

1. **Frontend:** A React and TypeScript interface for ticket management, dashboard analytics, and support workflows.
2. **Data Layer:** Supabase integration and database schema for persistent ticket storage and related records.
3. **Automation Layer:** An n8n webhook workflow designed to receive ticket events and support external notification integrations.

## Current Implementation Status

| Component | Status |
|---|---|
| Dashboard and analytics UI | Implemented |
| Ticket creation and management | Implemented in demo mode |
| Search and status filtering | Implemented |
| Responsive interface | Implemented |
| Supabase database schema | Provided |
| Supabase ticket persistence | Starter integration |
| AI-generated replies | Demo interaction; live LLM not connected |
| n8n notification workflow | Starter workflow |
| Authentication and organization-level access | Not yet implemented |
| Deployment | Future step |

**Important:** The current version is a functional UI prototype with demo-mode workflows and starter integrations. Supabase persistence requires configuration. Live LLM generation, complete authentication, production-grade authorization, and end-to-end notification delivery are not yet implemented.

## Getting Started

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/YOUR_USERNAME/supportflow-ai.git
cd supportflow-ai
npm install
cp .env.example .env
npm run dev
```

Open the local URL provided by Vite, usually `http://localhost:5173`.

The application runs in demo mode by default. Demo data is stored in memory and resets when the page is refreshed.

## Supabase Configuration

To enable database persistence:

1. Create a project in [Supabase](https://supabase.com/).
2. Execute `supabase/schema.sql` in the SQL Editor.
3. Configure the project URL and public anon key in `.env`.
4. Set `VITE_DEMO_MODE=false`.
5. Restart the development server.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_DEMO_MODE=false
```

The current integration supports ticket insertion and status updates. Authentication, organization-level authorization, and production-grade access control require further development. Never expose Supabase service-role keys in frontend environment variables.

## n8n Workflow Integration

The repository includes a starter workflow at:

```text
n8n/supportflow-ticket-notification.json
```

Import it into n8n using **Import from File**. The workflow receives and normalizes ticket notification payloads.

It can be extended with email, Slack, CRM, or other service integrations. Actual notification delivery requires configuring the relevant nodes, credentials, and webhook connection.

## AI-Assisted Development Approach

SupportFlow AI also demonstrates an iterative Vibe Coding workflow:

- **Lovable:** Exploring product concepts and interface directions.
- **Cursor:** Reviewing generated code, implementing application logic, and refactoring.
- **Developer Review:** Inspecting generated changes, validating implementation decisions, and testing application workflows.

The project emphasizes reviewing and understanding AI-generated code rather than relying on automatic code generation alone.

## Future Development

- Integrate an LLM through a secure server-side API.
- Implement RAG-based response suggestions grounded in approved support documentation.
- Add authentication and organization-level access control.
- Introduce ticket assignment, comments, and event history.
- Connect ticket creation to automated n8n workflows.
- Add automated tests and deployment.

## Project Structure

```text
src/
  App.tsx
  data.ts
  lib/
    supabase.ts
  types.ts
  styles.css

supabase/
  schema.sql

n8n/
  supportflow-ticket-notification.json
```

## Project Purpose

SupportFlow AI explores how modern frontend technologies, database services, AI-assisted development, and workflow automation can be used to build a customer support management product. It serves as a practical portfolio project focused on product thinking, application architecture, and the gradual integration of AI capabilities into business workflows.



flowchart TD
    A["مشتری"] --> B["ثبت درخواست پشتیبانی"]
    B --> C["SupportFlow AI"]

    C --> D["مدیریت و دسته‌بندی تیکت"]
    D --> E["ذخیره و مدیریت اطلاعات"]

    E --> F["داشبورد مدیریتی"]
    F --> G["بررسی وضعیت و اولویت تیکت"]

    G --> H{"نیاز به پاسخ هوشمند؟"}

    H -->|بله| I["تولید پاسخ پیشنهادی با LLM"]
    I --> J["بازیابی اطلاعات از پایگاه دانش RAG"]
    J --> K["بررسی و تأیید پاسخ"]

    H -->|خیر| K

    K --> L["به‌روزرسانی وضعیت تیکت"]
    L --> M["ثبت رویداد و پیگیری درخواست"]

    M --> N["n8n Workflow"]
    N --> O["اعلان و یکپارچه‌سازی با سرویس‌های خارجی"]



## معرفی پروژه به زبان فارسی
پروژه **SupportFlow AI** یک نمونه اولیه از پلتفرم مدیریت هوشمند پشتیبانی مشتریان است که با هدف بهبود فرآیند دریافت، دسته‌بندی، مدیریت و پاسخ‌گویی به درخواست‌های مشتریان طراحی شده است. این سامانه با فراهم‌کردن یک داشبورد مدیریتی، امکان مشاهده وضعیت تیکت‌ها، بررسی اطلاعات مشتریان، جست‌وجو و فیلتر درخواست‌ها و مدیریت وضعیت آن‌ها را در یک محیط یکپارچه فراهم می‌کند.

در طراحی این پروژه، علاوه بر توسعه رابط کاربری و ساختار مدیریت اطلاعات، امکان اتصال به پایگاه داده Supabase و ابزار اتوماسیون n8n نیز در نظر گرفته شده است. همچنین بستری برای توسعه قابلیت‌های هوش مصنوعی، از جمله تولید پاسخ پیشنهادی با استفاده از مدل‌های زبانی و بازیابی اطلاعات از پایگاه دانش (RAG)، پیش‌بینی شده است.

هدف اصلی پروژه، نمایش کاربرد عملی فناوری‌های هوش مصنوعی، توسعه محصول و اتوماسیون گردش‌کارهای پشتیبانی مشتریان است. نسخه فعلی شامل رابط کاربری و گردش‌کارهای نمایشی مدیریت تیکت است و اتصال کامل مدل زبانی، احراز هویت و اتوماسیون انتها‌به‌انتها در مراحل توسعه آتی قرار دارند.
