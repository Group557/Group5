export const COLLAPSED_EXERCISE_LIMIT = 3;

export function getWorkoutExerciseVisibility<T>(
  exercises: T[],
  expanded: boolean
) {
  return {
    visibleExercises: expanded
      ? exercises
      : exercises.slice(0, COLLAPSED_EXERCISE_LIMIT),
    canViewMore: exercises.length > COLLAPSED_EXERCISE_LIMIT,
    hiddenExerciseCount: Math.max(
      exercises.length - COLLAPSED_EXERCISE_LIMIT,
      0
    )
  };
}

export function toggleWorkoutExerciseVisibility(
  expandedWorkoutIds: Record<number, boolean>,
  workoutId: number
): Record<number, boolean> {
  return {
    ...expandedWorkoutIds,
    [workoutId]: !expandedWorkoutIds[workoutId]
  };
}
