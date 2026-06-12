-- AI Training Platform - initial schema
-- All learning content is public/static. This schema backs the OPTIONAL,
-- sign-in-only gamification layer plus always-on anonymous analytics.

-- =====================================================================
-- Reference data
-- =====================================================================

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  criteria text not null,
  icon text,
  sort integer not null default 0
);

-- =====================================================================
-- User-owned data
-- =====================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  department_id uuid references public.departments(id) on delete set null,
  avatar_url text,
  xp integer not null default 0,
  pathway_id text,
  leaderboard_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  status text not null default 'completed' check (status in ('in_progress', 'completed')),
  quiz_score integer,
  quiz_total integer,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  points integer not null,
  ref text,
  created_at timestamptz not null default now()
);
create index if not exists xp_events_user_idx on public.xp_events (user_id);
create index if not exists xp_events_created_idx on public.xp_events (created_at);

create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current integer not null default 0,
  longest integer not null default 0,
  last_active_date date,
  freezes_remaining integer not null default 2,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pathway_id text not null,
  issued_at timestamptz not null default now(),
  unique (user_id, pathway_id)
);

create table if not exists public.portfolio_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  format text not null,
  summary text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_entries_user_idx on public.portfolio_entries (user_id);

create table if not exists public.portfolio_artifacts (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.portfolio_entries(id) on delete cascade,
  phase integer,
  artifact_key text,
  title text,
  content text,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists portfolio_artifacts_entry_idx on public.portfolio_artifacts (entry_id);

-- =====================================================================
-- Analytics (anonymous + signed-in). Feeds the admin dashboard.
-- =====================================================================

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  anon_id text,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  path text,
  lesson_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on public.analytics_events (created_at);
create index if not exists analytics_events_type_idx on public.analytics_events (event_type);

-- =====================================================================
-- Demo data for a populated leaderboard (kept separate from real users
-- so we never have to fake rows in auth.users).
-- =====================================================================

create table if not exists public.seed_members (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  department_id uuid references public.departments(id) on delete set null,
  avatar_url text,
  xp integer not null default 0,
  weekly_xp integer not null default 0
);

-- =====================================================================
-- Triggers: auto-create profile + streak; keep cached XP in sync
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.streaks (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_xp_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
    set xp = xp + new.points, updated_at = now()
    where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists on_xp_event_insert on public.xp_events;
create trigger on_xp_event_insert
  after insert on public.xp_events
  for each row execute function public.handle_xp_event();

-- =====================================================================
-- Leaderboard views (real users + demo members, weekly + all-time).
-- These run with definer rights so weekly aggregates over xp_events
-- are visible to anyone; they expose only public, aggregate display data.
-- =====================================================================

create or replace view public.leaderboard_individual as
  select
    p.id,
    p.display_name,
    p.department_id,
    p.avatar_url,
    p.xp as total_xp,
    coalesce(
      (
        select sum(x.points)
        from public.xp_events x
        where x.user_id = p.id
          and x.created_at >= now() - interval '7 days'
      ),
      0
    )::integer as weekly_xp,
    false as is_seed
  from public.profiles p
  where p.leaderboard_opt_in = true
  union all
  select
    s.id,
    s.display_name,
    s.department_id,
    s.avatar_url,
    s.xp as total_xp,
    s.weekly_xp,
    true as is_seed
  from public.seed_members s;

create or replace view public.leaderboard_team as
  select
    d.id as department_id,
    d.name as department_name,
    d.slug,
    coalesce(sum(m.total_xp), 0)::integer as total_xp,
    coalesce(sum(m.weekly_xp), 0)::integer as weekly_xp,
    count(m.id) as members
  from public.departments d
  left join public.leaderboard_individual m on m.department_id = d.id
  group by d.id, d.name, d.slug;

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table public.departments enable row level security;
alter table public.badges enable row level security;
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.xp_events enable row level security;
alter table public.streaks enable row level security;
alter table public.user_badges enable row level security;
alter table public.certificates enable row level security;
alter table public.portfolio_entries enable row level security;
alter table public.portfolio_artifacts enable row level security;
alter table public.analytics_events enable row level security;
alter table public.seed_members enable row level security;

-- Public reference data: readable by everyone
create policy "departments are public" on public.departments for select using (true);
create policy "badges are public" on public.badges for select using (true);
create policy "seed members are public" on public.seed_members for select using (true);

-- Profiles: public read (display name + xp power the leaderboard); self write
create policy "profiles are public" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Lesson progress: owner only
create policy "own progress select" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.lesson_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own progress delete" on public.lesson_progress for delete using (auth.uid() = user_id);

-- XP events: owner read/insert only (no edits)
create policy "own xp select" on public.xp_events for select using (auth.uid() = user_id);
create policy "own xp insert" on public.xp_events for insert with check (auth.uid() = user_id);

-- Streaks: owner only
create policy "own streak select" on public.streaks for select using (auth.uid() = user_id);
create policy "own streak insert" on public.streaks for insert with check (auth.uid() = user_id);
create policy "own streak update" on public.streaks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User badges: owner only
create policy "own badges select" on public.user_badges for select using (auth.uid() = user_id);
create policy "own badges insert" on public.user_badges for insert with check (auth.uid() = user_id);

-- Certificates: public read (shareable), self insert
create policy "certificates are public" on public.certificates for select using (true);
create policy "own certificate insert" on public.certificates for insert with check (auth.uid() = user_id);

-- Portfolio entries: owner or published; self write
create policy "portfolio read own or published" on public.portfolio_entries
  for select using (auth.uid() = user_id or published = true);
create policy "portfolio insert own" on public.portfolio_entries
  for insert with check (auth.uid() = user_id);
create policy "portfolio update own" on public.portfolio_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "portfolio delete own" on public.portfolio_entries
  for delete using (auth.uid() = user_id);

-- Portfolio artifacts: follow the parent entry
create policy "artifact read own or published" on public.portfolio_artifacts
  for select using (
    exists (
      select 1 from public.portfolio_entries e
      where e.id = entry_id and (e.user_id = auth.uid() or e.published = true)
    )
  );
create policy "artifact write own" on public.portfolio_artifacts
  for all using (
    exists (
      select 1 from public.portfolio_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.portfolio_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

-- Analytics: anyone (anon or signed-in) may write events; only the service
-- role (admin) reads them, so no SELECT policy is defined.
create policy "anyone can insert analytics" on public.analytics_events
  for insert with check (true);

-- Expose leaderboard views to clients
grant select on public.leaderboard_individual to anon, authenticated;
grant select on public.leaderboard_team to anon, authenticated;
