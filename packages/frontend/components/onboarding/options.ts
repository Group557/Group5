export const GOAL_OPTIONS = [
  { value: "build_muscle", label: "Build muscle" },
  { value: "improve_strength", label: "Improve strength" },
  {
    value: "improve_cardio_endurance",
    label: "Improve cardio endurance"
  },
  { value: "lose_weight", label: "Lose weight" },
  { value: "gain_weight", label: "Gain weight" },
  {
    value: "maintain_current_fitness",
    label: "Maintain current fitness"
  },
  {
    value: "improve_flexibility_mobility",
    label: "Improve flexibility and mobility"
  },
  {
    value: "improve_balance_stability",
    label: "Improve balance and stability"
  },
  {
    value: "build_workout_habit",
    label: "Build a consistent workout habit"
  },
  {
    value: "improve_sports_performance",
    label: "Improve sports performance"
  }
] as const;
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
] as const;


export const BODY_AREA_OPTIONS = [
    { value: "full_body", label: "Full body" },
    { value: "upper_body", label: "Upper body" },
    { value: "lower_body", label: "Lower body" },
    { value: "core_abs", label: "Core / abs" },
  ] as const;
  
  export const EXPERIENCE_OPTIONS = [
    {
      value: "beginner",
      label: "Beginner",
      description: "I am new to working out or getting started again.",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "I work out regularly and know the basics.",
    },
    {
      value: "advanced",
      label: "Advanced",
      description:
        "I have substantial experience following structured workouts.",
    },
  ] as const;
  
  export const WORKOUT_DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;
