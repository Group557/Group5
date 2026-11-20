import { filterExercises } from "./exerciseFiltering";

test("filters exercises by a typed exercise name", () => {
  // Arrange
  const exercises = [
    { id: 1, exercise_name: "3/4 Sit-Up" },
    { id: 2, exercise_name: "90/90 Hamstring" }
  ];

  // Act
  const result = filterExercises(exercises, "sit");

  // Assert
  expect(result).toEqual([
    { id: 1, exercise_name: "3/4 Sit-Up" }
  ]);
});
