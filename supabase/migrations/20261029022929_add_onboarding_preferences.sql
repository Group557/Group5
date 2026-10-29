alter table public.profiles
  add column primary_goal text,
  add column body_focus_areas text[],
  add column experience_level text,
  add column workout_days_per_week smallint;

alter table public.profiles
  add column height_cm numeric;

alter table public.profiles
  add constraint profiles_primary_goal_check
    check (
        primary_goal in (
        'build_muscle',
        'improve_strength',
        'improve_cardio_endurance',
        'lose_weight',
        'gain_weight',
        'maintain_current_fitness',
        'improve_flexibility_mobility',
        'improve_balance_stability',
        'build_workout_habit',
        'improve_sports_performance'
    )
  );

alter table public.profiles
  add constraint profiles_experience_level_check
    check (
        experience_level in (
        'beginner',
        'intermediate',
        'advanced'
    )
  );

alter table public.profiles
  add constraint profiles_workout_days_per_week_check
    check (
        workout_days_per_week between 1 and 7
    );

alter table public.profiles
  add constraint profiles_body_focus_areas_check
    check (
        body_focus_areas <@ array[
            'upper_body',
            'lower_body',
            'full_body',
            'core_abs'
            
        ]::text[]
    );

alter table public.profiles
  add constraint profiles_body_focus_areas_full_body_check
  check (
    not ('full_body' = any(body_focus_areas))
    or cardinality(body_focus_areas) = 1
  );

create function public.has_unique_text_values(items text[])
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select count(*) = count(distinct entry)
  from unnest(items) as selections(entry);
$$;

alter table public.profiles
  add constraint profiles_body_focus_areas_unique_check
  check (
    public.has_unique_text_values(body_focus_areas)
  );

alter table public.profiles
  add constraint profiles_body_focus_areas_goal_check
  check (
    body_focus_areas is null
    or (
      primary_goal is not null
      and primary_goal in (
        'build_muscle',
        'improve_strength'
      )
    )
  );
update public.profiles
set onboarded = false;

  alter table public.profiles
  add constraint profiles_onboarding_complete_check
  check (
    onboarded = false
    or (
      primary_goal is not null
      and experience_level is not null
      and workout_days_per_week is not null
      and (
        primary_goal not in (
          'build_muscle',
          'improve_strength'
        )
        or (
          body_focus_areas is not null
          and cardinality(body_focus_areas) > 0
        )
      )
    )
  );

  alter table public.profiles
  add constraint profiles_height_cm_check
  check (
    height_cm > 0
    and height_cm < 'Infinity'::numeric
  );

  alter table public.profiles
  add constraint profiles_body_focus_areas_shape_check
  check (
    body_focus_areas is null
    or cardinality(body_focus_areas) = 0
    or array_ndims(body_focus_areas) = 1
  );