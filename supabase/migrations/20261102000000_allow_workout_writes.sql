-- Workouts had RLS enabled with no policies, so every insert was rejected.
drop policy if exists "allow anon read workouts" on public.workouts;
create policy "allow anon read workouts" on public.workouts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "allow anon insert workouts" on public.workouts;
create policy "allow anon insert workouts" on public.workouts
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "allow anon update workouts" on public.workouts;
create policy "allow anon update workouts" on public.workouts
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "allow anon delete workouts" on public.workouts;
create policy "allow anon delete workouts" on public.workouts
  for delete
  to anon, authenticated
  using (true);

-- Exercises only had a SELECT policy, so adding or favoriting failed too.
drop policy if exists "allow anon insert exercises" on public.exercises;
create policy "allow anon insert exercises" on public.exercises
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "allow anon update exercises" on public.exercises;
create policy "allow anon update exercises" on public.exercises
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- add-workout.tsx links workouts to exercises through this table, but it
-- does not exist in the live database yet.
create table if not exists public.workout_exercises (
  workout_id bigint not null references public.workouts(id) on delete cascade,
  exercise_id bigint not null references public.exercises(id) on delete cascade,
  primary key (workout_id, exercise_id)
);

alter table public.workout_exercises enable row level security;

drop policy if exists "allow anon read workout_exercises" on public.workout_exercises;
create policy "allow anon read workout_exercises" on public.workout_exercises
  for select
  to anon, authenticated
  using (true);

drop policy if exists "allow anon insert workout_exercises" on public.workout_exercises;
create policy "allow anon insert workout_exercises" on public.workout_exercises
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "allow anon update workout_exercises" on public.workout_exercises;
create policy "allow anon update workout_exercises" on public.workout_exercises
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "allow anon delete workout_exercises" on public.workout_exercises;
create policy "allow anon delete workout_exercises" on public.workout_exercises
  for delete
  to anon, authenticated
  using (true);

grant select, insert, update, delete
  on public.workout_exercises
  to anon, authenticated;
