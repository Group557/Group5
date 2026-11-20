type SearchableExercise = {
  id: number;
  exercise_name: string;
};

export function filterExercises<T extends SearchableExercise>(
  exercises: T[],
  searchQuery: string
): T[] {
  return exercises.filter((exercise) =>
    exercise.exercise_name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );
}
