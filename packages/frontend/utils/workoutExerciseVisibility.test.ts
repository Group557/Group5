import {
  getWorkoutExerciseVisibility,
  toggleWorkoutExerciseVisibility
} from "./workoutExerciseVisibility";

test("shows all exercises after View more is pressed when there are more than three", () => {
  // Arrange
  const workoutId = 10;
  const exercises = [
    { id: 1, exercise_name: "Squat" },
    { id: 2, exercise_name: "Bench Press" },
    { id: 3, exercise_name: "Deadlift" },
    { id: 4, exercise_name: "Pull-Up" }
  ];
  let expandedWorkoutIds: Record<number, boolean> = {};

  const collapsedView = getWorkoutExerciseVisibility(
    exercises,
    expandedWorkoutIds[workoutId] ?? false
  );

  expect(collapsedView.canViewMore).toBe(true);
  expect(collapsedView.visibleExercises).toEqual(
    exercises.slice(0, 3)
  );
  expect(collapsedView.hiddenExerciseCount).toBe(1);

  // Act: the View more button uses this state update when pressed.
  expandedWorkoutIds = toggleWorkoutExerciseVisibility(
    expandedWorkoutIds,
    workoutId
  );

  const expandedView = getWorkoutExerciseVisibility(
    exercises,
    expandedWorkoutIds[workoutId]
  );

  // Assert
  expect(expandedView.visibleExercises).toEqual(exercises);
});
