-- Seed reference data + demo leaderboard members.
-- Safe to re-run (idempotent via ON CONFLICT).

insert into public.departments (name, slug) values
  ('Engineering', 'engineering'),
  ('Product', 'product'),
  ('Design', 'design'),
  ('Data & Analytics', 'data'),
  ('Marketing', 'marketing'),
  ('Sales', 'sales'),
  ('Customer Success', 'customer-success'),
  ('Operations', 'operations'),
  ('Legal & Risk', 'legal-risk'),
  ('People & HR', 'people')
on conflict (slug) do nothing;

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

-- Demo members so the leaderboard looks alive on day one.
insert into public.seed_members (display_name, department_id, xp, weekly_xp)
select v.display_name, d.id, v.xp, v.weekly_xp
from (values
  ('Maya Chen',        'engineering',      8420, 620),
  ('Liam Okafor',      'engineering',      7180, 410),
  ('Priya Nair',       'data',             6890, 540),
  ('Diego Alvarez',    'product',          6240, 300),
  ('Sofia Rossi',      'design',           5910, 480),
  ('Noah Williams',    'engineering',      5480, 210),
  ('Hana Kim',         'data',             5120, 360),
  ('Omar Haddad',      'product',          4870, 260),
  ('Emma Thompson',    'marketing',        4510, 320),
  ('Yuki Tanaka',      'design',           4180, 190),
  ('Lucas Martin',     'sales',            3920, 280),
  ('Aisha Bello',      'customer-success', 3640, 240),
  ('Felix Braun',      'operations',       3380, 150),
  ('Grace Mwangi',     'legal-risk',       3120, 300),
  ('Carlos Mendes',    'engineering',      2980, 120),
  ('Nina Petrova',     'data',             2740, 200),
  ('Tom Becker',       'product',          2510, 90),
  ('Layla Hassan',     'marketing',        2280, 160),
  ('Ethan Park',       'sales',            2040, 110),
  ('Zoe Dubois',       'people',           1870, 220),
  ('Ravi Gupta',       'customer-success', 1620, 130),
  ('Mia Andersson',    'legal-risk',       1410, 180),
  ('Jonas Vidic',      'operations',       1180, 70),
  ('Sara Lindgren',    'people',            940, 140)
) as v(display_name, dept_slug, xp, weekly_xp)
join public.departments d on d.slug = v.dept_slug
where not exists (
  select 1 from public.seed_members s where s.display_name = v.display_name
);
