alter table public.exercises
  add column image_paths text[] not null default '{}';