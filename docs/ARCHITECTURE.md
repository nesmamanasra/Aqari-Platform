# Aqari Architecture

## Current Structure

The project no longer uses a custom NestJS backend. The system is now Supabase-first:

```txt
React Frontend
  ↓
Supabase Database / Storage / Auth
  ↓
Supabase Edge Function: aqari-ai-agent
  ↓
OpenAI API
```

## Why This Change?

This keeps the project simpler while still protecting sensitive keys:

- React reads/writes normal app data through Supabase.
- The OpenAI key is kept only in Supabase Secrets.
- The AI Agent runs inside a Supabase Edge Function.
- The old backend folder and localhost API dependency were removed.

## AI Agent Flow

1. User writes a message in `AqariAiAgent`.
2. React calls:

```js
supabase.functions.invoke('aqari-ai-agent', {
  body: { message }
});
```

3. The Edge Function asks OpenAI to extract filters like city, property type, operation type, and price.
4. The Edge Function queries `properties` from Supabase where `status = 'متاح'`.
5. It returns a reply and matching properties to the frontend.

## Files

```txt
frontend/src/features/ai/services/aiAgentApi.js
frontend/src/features/ai/components/AqariAiAgent.jsx
frontend/supabase/functions/aqari-ai-agent/index.ts
```

## Security Rule

Never place these in React/Vite env files:

```txt
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Only use them in Supabase Edge Functions / Supabase Secrets.
