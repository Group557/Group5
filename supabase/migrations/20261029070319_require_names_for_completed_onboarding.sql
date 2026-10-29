alter table public.profiles
  add constraint profiles_completed_names_check
  check (
    onboarded = false
    or (
      first_name is not null
      and first_name ~ '[^[:space:]]'
      and last_name is not null
      and last_name ~ '[^[:space:]]'
    )
  );