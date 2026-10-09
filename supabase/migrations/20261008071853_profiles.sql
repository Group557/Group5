create table public.profiles(
    id uuid primary key references auth.users(id) on delete cascade,
    last_name text,
    first_name text,
    age int,
    gender text,
    onboarded Boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.profiles
enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);