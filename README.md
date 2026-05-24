# Mini AI HR Admin System

An AI-powered HR administration system where HR Admins can manage employee records through a normal UI or by typing natural language commands to the AI Assistant.

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL + Auth)
- **AI**: Groq API with Llama 3.3 70B
- **Deployment**: Vercel

## How to Run Locally

1. Clone the repository:
   git clone https://github.com/nabilalharethi/mini-ai-hr.git
   cd mini-ai-hr

2. Install dependencies:
   npm install

3. Set up environment variables:
   cp .env.example .env.local
   Fill in your keys (see below)

4. Run the development server:
   npm run dev

5. Open http://localhost:3000

## Environment Variables

| Variable | Where to get it |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase → Settings → API → Project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase → Settings → API → anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase → Settings → API → service_role key |
| GROQ_API_KEY | console.groq.com → API Keys → Create Key |

## How the AI HR Assistant Works

1. HR Admin types a natural language prompt in the chat
2. The message is sent to the `/api/ai` route
3. Groq (Llama 3.3 70B) classifies the intent and extracts data as JSON
4. The system executes the real database operation via Supabase
5. A confirmation message is returned and shown in the chat

## Supported AI Prompts

- `Show me all active employees`
- `Create an employee named John Doe, email john@company.com, job title Software Engineer, department Engineering, joining date 2026-01-15, location Stockholm`
- `Update John Doe's department to Product and job title to Senior Engineer`
- `Generate an employee summary for John Doe`
- `Deactivate John Doe`

## Test Login

- **Email**: admin@miniaihr.com
- **Password**: Admin123!

## Known Limitations

- Chat history resets on page refresh
- Employee name search uses partial match
- Groq free tier: 30 requests/minute, 14,400 requests/day