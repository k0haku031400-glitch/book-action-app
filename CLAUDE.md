# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev -- -p 3001   # Dev server (port 3001; 3000 is reserved for Grafana)
npm run build            # prisma generate + next build
npm run lint             # ESLint
npm run db:generate      # Regenerate Prisma client (after schema changes)
npm run db:migrate       # Run migrations (see caution below)
npm run db:studio        # Open Prisma Studio
```

> **Caution**: The local `.env.local` connects to the **production database** (pulled via `vercel env pull`). Never run `db:migrate` locally — it may prompt to reset the prod DB. Schema changes must go through a production deployment migration.

## Architecture

This is a Next.js 16 app (App Router) with React 19, deployed on Vercel.

**Core flow**: User registers a book → fills in summary, key points, and personal goals → OpenAI generates a 4-week action plan (12–20 tasks) → user works through tasks week by week → completes tasks with optional reflections → earns points/streaks tracked in `UserStats`.

### Key layers

| Layer | Location | Notes |
|---|---|---|
| Pages | `src/app/` | App Router; protected routes under `/dashboard` and `/books` |
| API routes | `src/app/api/` | Server-side only; all routes call `requireAuth()` first |
| Auth | `src/lib/auth.ts` + `src/middleware.ts` | NextAuth v5 beta with Credentials + optional Google OAuth |
| DB | `src/lib/prisma.ts` | Prisma 7 with `@prisma/adapter-pg` (driver adapter pattern, not the default engine) |
| AI | `src/lib/openai.ts` | GPT-4o-mini generates JSON action plans; guarded by `OPENAI_API_KEY` env check |
| Validation | `src/lib/validations.ts` | Zod schemas shared between API and forms |
| Utils | `src/lib/api-utils.ts` | `requireAuth`, `apiError`/`apiSuccess` helpers, in-memory rate limiter |

### Auth split

Auth config is split across two files intentionally (NextAuth v5 edge-middleware constraint):
- `src/lib/auth.config.ts` — edge-safe config (no Node APIs), imported by middleware
- `src/lib/auth.ts` — full config with PrismaAdapter and providers, imported by API routes/Server Components

### Prisma client location

The generated client lives in `src/generated/prisma/` (not the default `node_modules`). Always import from `@/generated/prisma/client`, not `@prisma/client`.

### Data model summary

`User` → `Book` (1:many) → `ActionPlan` (1:1) → `Task` (1:many)  
`User` → `UserStats` (1:1, gamification data)

Tasks have `weekNumber` (1–4), `frequency` (DAILY/WEEKLY/ONCE), optional `dayNumber`, and `order` for display sequencing.

### Route protection

Middleware (`src/middleware.ts`) redirects unauthenticated users away from `/dashboard` and `/books`, and redirects authenticated users away from `/signin` and `/signup`.

### UI stack

shadcn/ui components (configured via `components.json`), Tailwind CSS v4, `next-themes` for dark mode, `react-hook-form` + Zod for forms, `sonner` for toasts.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Prisma Accelerate in prod) |
| `AUTH_SECRET` | NextAuth secret |
| `AUTH_URL` | Full base URL (`http://localhost:3001` locally) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | Shows Google login button when `"true"` |
| `OPENAI_API_KEY` | Optional; action plan generation is skipped when absent |
