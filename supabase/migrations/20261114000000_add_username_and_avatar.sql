alter table public.profiles
  add column if not exists username text,
  add column if not exists avatar_url text;

create or replace function public.generate_username(user_email text)
returns text
language plpgsql
as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  base := lower(regexp_replace(split_part(user_email, '@', 1), '[^a-zA-Z0-9._]', '', 'g'));
  if length(base) < 3 then
    base := rpad(base, 3, '0');
  end if;
  base := left(base, 16);             
  candidate := base;

  while exists (select 1 from public.profiles where username = candidate) loop
    n := n + 1;
    candidate := base || n;
  end loop;

  return candidate;
end;
$$;

do $$
declare
  r record;
begin
  for r in
    select p.id, u.email
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.username is null
    order by p.created_at
  loop
    update public.profiles
    set username = public.generate_username(r.email)
    where id = r.id;
  end loop;
end;
$$;

alter table public.profiles
  add constraint profiles_username_key unique (username),
  add constraint profiles_username_format check (username ~ '^[a-z0-9._]{3,20}$');

create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, public.generate_username(new.email))
  on conflict (id) do update
    set username = coalesce(public.profiles.username, excluded.username);

  return new;
end;
$$;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
