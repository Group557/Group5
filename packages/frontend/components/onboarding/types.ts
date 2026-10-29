import type { GOAL_OPTIONS } from "./options";

export type PrimaryGoal =
  (typeof GOAL_OPTIONS)[number]["value"];

export type OnboardingStep =
  | "name"
  | "age"
  | "height"
  | "gender"
  | "goal"
  | "bodyAreas"
  | "experience"
  | "availability";

export type BodyFocusArea =
  | "full_body"
  | "upper_body"
  | "lower_body"
  | "core_abs";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type Gender = "male" | "female";