# AI Training Platform

An interactive, visual-first platform that turns a 12-level AI curriculum into
polished, hands-on lessons - quizzes, diagrams, charts, and live interactives.

All learning content is **public** and works fully signed-out (progress is saved
in your browser). An optional sign-in adds a gamification layer: XP, streaks,
badges, leaderboards, certificates, and a personal portfolio.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + **shadcn/ui**, **Motion** for animation
- **MDX** for lessons, **Mermaid** for diagrams, **Recharts** for charts
- **Supabase** (Postgres + Auth + RLS) for the optional gamification layer

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 and is fully usable without any setup.

## Optional: enable gamification

Sign-in, leaderboards, and analytics require a [Supabase](https://supabase.com)
project. Copy your project URL and keys into `.env` (see `.env.example`), then
apply `supabase/migrations/20260612000001_init.sql` and `supabase/seed.sql` via
the SQL Editor or `supabase db push`. Turn off "Confirm email" under
**Authentication > Providers > Email**, then restart the dev server.

## Project layout

- `content/` - curriculum, pathways, glossary, gamification, portfolio (JSON)
- `CURRICULUM.md` - authoring source of truth for lessons
- `src/app/` - routes (`/learn`, `/pathways`, `/portfolio`, `/glossary`,
  `/leaderboard`, `/profile`, `/admin`)
- `src/components/` - UI, layout, lesson, and interactive components
- `src/lib/supabase/` - typed browser/server/admin clients
- `supabase/` - SQL migrations + seed

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
