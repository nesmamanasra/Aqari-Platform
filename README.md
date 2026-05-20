# Aqari Management Platform

Aqari Pro is now organized around a lighter Supabase-first architecture:

```txt
Aqari-Management-Platform/
├── frontend/   # React + Vite + Tailwind
├── docs/       # architecture notes
└── README.md
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## AI Agent Architecture

The old NestJS backend was removed. The AI flow now works through Supabase Edge Functions:

```txt
React Frontend
  ↓ supabase.functions.invoke("aqari-ai-agent")
Supabase Edge Function
  ↓ reads available properties from Supabase
OpenAI API
```

## Required Frontend Env

Create `frontend/.env` from `frontend/.env.example`:

```txt
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Do not put `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in the frontend.

## Required Supabase Secret

Set the OpenAI key in Supabase secrets:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.

## Deploy Edge Function

From inside `frontend/`:

```bash
supabase functions deploy aqari-ai-agent
```

Then run the React frontend normally.
