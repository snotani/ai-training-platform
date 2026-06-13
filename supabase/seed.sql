-- Seed reference data + demo leaderboard members.
-- Safe to re-run (idempotent via ON CONFLICT).

insert into public.badges (id, name, criteria, icon, sort) values
  ('first-lesson', 'First Steps', 'Complete your first lesson.', 'footprints', 1),
  ('level-complete', 'Level Cleared', 'Complete all lessons + mini-project in a level.', 'layers', 2),
  ('perfect-quiz', 'Flawless', 'Score 100% on a lesson quiz.', 'sparkles', 3),
  ('streak-7', 'On a Roll', 'Maintain a 7-day streak.', 'flame', 4),
  ('streak-30', 'Unstoppable', 'Maintain a 30-day streak.', 'zap', 5),
  ('pathway-complete', 'Path Finisher', 'Complete a full pathway.', 'route', 6),
  ('capstone', 'End-to-End', 'Complete a pathway capstone.', 'trophy', 7)
on conflict (id) do update set
  name = excluded.name,
  criteria = excluded.criteria,
  icon = excluded.icon,
  sort = excluded.sort;

-- A few demo members so the board isn't empty on day one. Kept small and with
-- realistic scores: only Level 1 (4 lessons + mini-project) is published, so a
-- maxed-out learner sits around ~550 XP - all still in the AI Novice league.
-- Re-running is idempotent: demo rows are fully replaced.
delete from public.seed_members;
insert into public.seed_members (display_name, region, xp, weekly_xp) values
  ('Amara Okafor',   'africa', 520, 300),
  ('Kenji Watanabe', 'asia',   290, 180),
  ('Lucia Ferrari',  'europe', 110, 110);
