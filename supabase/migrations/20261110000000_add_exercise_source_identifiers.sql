alter table public.exercises
  add column source text,
  add column source_id text;

alter table public.exercises
  add constraint exercises_source_source_id_key
  unique (source, source_id);
