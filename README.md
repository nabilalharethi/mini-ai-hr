# Mini AI HR Admin System

AI-powered HR admin app. Manage employee records through a normal UI
or by typing natural language commands to the Gemini AI Assistant.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini 1.5 Flash with function calling
- **Deployment**: Vercel

## Run Locally

git clone https://github.com/nabilalharethi/mini-ai-hr.git
cd mini-ai-hr
npm install
cp .env.example .env.local
# Fill in your keys
npm run dev

## Environment Variables

| Variable | Where to get it |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase → Settings → API → Project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase → Settings → API → anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase → Settings → API → service_role key |
| GEMINI_API_KEY | aistudio.google.com → Get API key |

## How the AI Works

1. HR Admin types a natural language prompt
2. Sent to `/api/ai` route
3. Gemini 1.5 Flash receives it with 5 tool definitions
4. Gemini decides which tool to call
5. Tool runs a real Supabase database operation
6. Result sent back to Gemini for a friendly reply
7. Reply shown in chat

## Example Prompts

- `Show me all active employees`
- `Create an employee named John Doe, email john@company.com, job title Software Engineer, department Engineering`
- `Update John Doe's department to Product`
- `Generate an employee summary for John Doe`
- `Deactivate John Doe`

## Test Login

- **Email**: admin@miniaihr.com
- **Password**: Admin123!

## Known Limitations

- Chat history resets on page refresh
- Employee name search is partial match
- Gemini free tier: 15 requests/minute