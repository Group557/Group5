begin;

-- Remove the earlier trigger that created profiles at registration.
drop trigger if exists on_auth_user_created on auth.users;

-- Define what happens when an email is confirmed.
create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Run the function when email confirmation changes
-- from unconfirmed (null) to confirmed (a timestamp).
drop trigger if exists on_auth_user_email_confirmed on auth.users;

create trigger on_auth_user_email_confirmed
after update of email_confirmed_at on auth.users
for each row
when (
  old.email_confirmed_at is null
  and new.email_confirmed_at is not null
)
execute function public.handle_confirmed_user();

-- Also create missing profiles for users already confirmed.
insert into public.profiles (id)
select id
from auth.users
where email_confirmed_at is not null
on conflict (id) do nothing;

commit;