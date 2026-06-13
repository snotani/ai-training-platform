-- Public launch: move the leaderboard away from internal "department" grouping.
-- New categorization dimensions:
--   1. Region  - a self-selected, globally meaningful group (replaces team board)
--   2. League  - a skill tier derived from XP (computed in the app from ranks)
-- The departments table is left in place (now unused) to avoid a destructive drop.

alter table public.profiles add column if not exists region text;
alter table public.seed_members add column if not exists region text;

-- Views must be rebuilt: CREATE OR REPLACE can't drop/rename existing columns,
-- and leaderboard_team/leaderboard_region depend on leaderboard_individual.
drop view if exists public.leaderboard_team;
drop view if exists public.leaderboard_region;
drop view if exists public.leaderboard_individual;

create view public.leaderboard_individual as
  select
    p.id,
    p.display_name,
    p.region,
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
    s.region,
    s.avatar_url,
    s.xp as total_xp,
    s.weekly_xp,
    true as is_seed
  from public.seed_members s;

-- Region leaderboard replaces the department/team board.
create view public.leaderboard_region as
  select
    m.region,
    coalesce(sum(m.total_xp), 0)::integer as total_xp,
    coalesce(sum(m.weekly_xp), 0)::integer as weekly_xp,
    count(*) as members
  from public.leaderboard_individual m
  where m.region is not null
  group by m.region;

grant select on public.leaderboard_individual to anon, authenticated;
grant select on public.leaderboard_region to anon, authenticated;

-- Demo members are managed by supabase/seed.sql. Clear any pre-existing rows so
-- the (now smaller, realistic) seed set is the single source of truth.
delete from public.seed_members;
