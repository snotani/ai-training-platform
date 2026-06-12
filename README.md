# AI Training Platform

An interactive, visual-first AI training platform that renders a 12-level
curriculum as polished, hands-on lessons. All learning content is **public**;
an optional sign-in unlocks gamification (XP, streaks, badges, leaderboards,
certificates) and a personal portfolio.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Base UI / `base-nova` style)
- **Motion** (Framer Motion) for animation, `next-themes` for dark/light
- **MDX** for lessons, **Mermaid** for diagrams, **Recharts** for charts
- **Supabase** (Postgres + Auth + RLS) for the optional gamification layer

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000. It works fully **without** Supabase -
every level, lesson, quiz, interactive, pathway, and glossary entry is usable
signed-out (progress is kept in your browser).

## Enabling gamification (Supabase)

Gamification, leaderboards, and analytics need a Supabase project.

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings > API**, copy the URL, the `anon` key, and the
   `service_role` key into a `.env` file (see `.env.example`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

3. Apply the schema + seed. Easiest path - open the **SQL Editor** in the
   Supabase dashboard and run, in order:
   - `supabase/migrations/20260612000001_init.sql`
   - `supabase/seed.sql`

   Or with the Supabase CLI (if you use it):

   ```bash
   supabase db push
   supabase db execute --file supabase/seed.sql
   ```

4. In **Authentication > Providers > Email**, turn **off** "Confirm email"
   (the platform uses email/password with no verification, plus magic links).

5. Restart `npm run dev`. The "Sign in" entry points now persist progress.

## Project layout

- `content/` - curriculum, pathways, glossary, gamification, portfolio (JSON)
- `CURRICULUM.md` - the authoring source of truth for lessons
- `src/content/lessons/` - authored MDX lessons (Level 1)
- `src/app/` - routes (landing, `/learn`, `/pathways`, `/portfolio`,
  `/glossary`, `/leaderboard`, `/profile`, `/admin`)
- `src/components/` - UI, layout, lesson, and interactive components
- `src/lib/supabase/` - typed clients (browser/server/admin) + session proxy
- `supabase/` - SQL migrations + seed

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
