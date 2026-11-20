-- Each draft gets a request ID so retries do not create duplicates.
alter table public.workouts
  add column client_request_id uuid not null
    default gen_random_uuid(),
  add constraint workouts_user_request_unique
    unique (user_id, client_request_id);


create function public.save_completed_workout(
  p_request_id uuid,
  p_name text,
  p_exercises jsonb,
  p_category text default null,
  p_notes text default null,
  p_performed_at timestamptz default now()
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_workout_id bigint;
  v_workout_exercise_id bigint;
  v_exercise_id bigint;

  v_exercise jsonb;
  v_set jsonb;

  v_exercise_position integer := 0;
  v_set_position integer;

  v_reps integer;
  v_weight numeric;
  v_category text := nullif(trim(p_category), '');
begin
  -- 1. Validate the user and workout details.
  if v_user_id is null then
    raise exception 'You must sign in to save a workout.';
  end if;

  if p_request_id is null then
    raise exception 'A save request ID is required.';
  end if;

  if p_name is null or p_name !~ '[^[:space:]]' then
    raise exception 'Please enter a workout name.';
  end if;

  if p_performed_at is null or not isfinite(p_performed_at) then
    raise exception 'A valid workout date is required.';
  end if;

  if v_category is not null and v_category not in (
    'Cardio / Aerobic',
    'Strength / Resistance',
    'HIIT',
    'Flexibility / Mobility',
    'Balance / Stability',
    'Circuit',
    'Other'
  ) then
    raise exception 'Please select a valid category.';
  end if;

  if jsonb_typeof(p_exercises) is distinct from 'array' then
    raise exception 'Exercises must be an array.';
  end if;

  if jsonb_array_length(p_exercises) = 0 then
    raise exception 'Please add at least one exercise.';
  end if;


  -- 2. Create the workout, or recognize a previously saved request.
  insert into public.workouts (
    user_id,
    client_request_id,
    workout_name,
    workout_category,
    workout_notes,
    performed_at,
    weight_unit
  )
  values (
    v_user_id,
    p_request_id,
    trim(p_name),
    v_category,
    nullif(trim(p_notes), ''),
    p_performed_at,
    'lb'
  )
  on conflict on constraint workouts_user_request_unique
  do nothing
  returning id into v_workout_id;

  if v_workout_id is null then
    select w.id
    into v_workout_id
    from public.workouts as w
    where w.user_id = v_user_id
      and w.client_request_id = p_request_id;

    if v_workout_id is null then
      raise exception 'Unable to resolve this save request. Please retry.';
    end if;

    return v_workout_id;
  end if;


  -- 3. Save each exercise in the supplied order.
  for v_exercise in
    select value from jsonb_array_elements(p_exercises)
  loop
    v_exercise_position := v_exercise_position + 1;

    if jsonb_typeof(v_exercise) is distinct from 'object' then
      raise exception 'Each exercise must be an object.';
    end if;

    if jsonb_typeof(v_exercise -> 'exercise_id')
         is distinct from 'number' then
      raise exception 'Each exercise needs a numeric exercise ID.';
    end if;

    if (v_exercise ->> 'exercise_id') !~ '^[0-9]+$' then
      raise exception 'Exercise IDs must be whole numbers.';
    end if;

    v_exercise_id := (v_exercise ->> 'exercise_id')::bigint;

    if v_exercise_id <= 0 then
      raise exception 'Exercise IDs must be positive.';
    end if;

    if not exists (
      select 1
      from public.exercises as e
      where e.id = v_exercise_id
    ) then
      raise exception 'Exercise % was not found.', v_exercise_id;
    end if;

    if jsonb_typeof(v_exercise -> 'sets')
         is distinct from 'array' then
      raise exception 'Each exercise needs a sets array.';
    end if;

    if jsonb_array_length(v_exercise -> 'sets') = 0 then
      raise exception 'Each exercise needs at least one set.';
    end if;

    insert into public.workout_exercises (
      workout_id,
      exercise_id,
      position
    )
    values (
      v_workout_id,
      v_exercise_id,
      v_exercise_position
    )
    returning id into v_workout_exercise_id;


    -- 4. Validate and save each set.
    v_set_position := 0;

    for v_set in
      select value
      from jsonb_array_elements(v_exercise -> 'sets')
    loop
      v_set_position := v_set_position + 1;

      if jsonb_typeof(v_set) is distinct from 'object' then
        raise exception 'Each set must be an object.';
      end if;

      if jsonb_typeof(v_set -> 'reps') is distinct from 'number'
         or jsonb_typeof(v_set -> 'weight') is distinct from 'number' then
        raise exception 'Reps and weight must be numbers.';
      end if;

      if (v_set ->> 'reps') !~ '^[0-9]+$' then
        raise exception 'Reps must be whole numbers.';
      end if;

      v_reps := (v_set ->> 'reps')::integer;
      v_weight := (v_set ->> 'weight')::numeric;

      if v_reps <= 0 then
        raise exception 'Reps must be greater than zero.';
      end if;

      if v_weight < 0 or v_weight > 99999999.99 then
        raise exception 'Weight must be between 0 and 99999999.99 lb.';
      end if;

      if v_weight <> round(v_weight, 2) then
        raise exception 'Weight can have at most two decimal places.';
      end if;

      insert into public.workout_sets (
        workout_exercise_id,
        position,
        reps,
        weight
      )
      values (
        v_workout_exercise_id,
        v_set_position,
        v_reps,
        v_weight
      );
    end loop;
  end loop;

  return v_workout_id;
end;
$$;


-- Only signed-in application users may call this function.
revoke all on function public.save_completed_workout(
  uuid, text, jsonb, text, text, timestamptz
) from public, anon;

grant execute on function public.save_completed_workout(
  uuid, text, jsonb, text, text, timestamptz
) to authenticated;