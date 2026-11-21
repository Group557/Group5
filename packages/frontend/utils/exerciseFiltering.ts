type SearchableExercise = {
  id: number;
  exercise_name: string;
  exercise_category?: string | null;
};

export function filterExercises<T extends SearchableExercise>(
  exercises: T[],
  searchQuery: string
): T[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return exercises.filter((exercise) => {
    const nameMatches = exercise.exercise_name
      .toLowerCase()
      .includes(normalizedQuery);

    const categoryMatches =
      exercise.exercise_category
        ?.toLowerCase()
        .includes(normalizedQuery) ?? false;

    return nameMatches || categoryMatches;
  });
}
