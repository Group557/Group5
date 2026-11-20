
-- Library exercises are readable by the app.
-- Ordinary app users should not modify the shared library.
drop policy if exists "allow anon insert exercises"
  on public.exercises;

drop policy if exists "allow anon update exercises"
  on public.exercises;

revoke insert, update, delete, truncate
on public.exercises
from anon, authenticated;