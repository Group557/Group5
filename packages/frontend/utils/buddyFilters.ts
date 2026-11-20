/** Same names and shape as the state in buddy-filters.tsx. */
export type BuddyFilters = {
  minAge: string;
  maxAge: string;
  major: string;
  goals: string[];
  genders: string[];
  availability: string[];
};

/** The minimum a buddy needs for filtering; extra fields are kept as-is. */
export type FilterableBuddy = {
  goals: string[];
};

/**
 * Keeps buddies who share at least one of the selected goals.
 * No goals selected means "any".
 *
 * Only `goals` is applied for now; the other filter fields are ignored.
 */
export function filterBuddies<T extends FilterableBuddy>(
  buddies: T[],
  filters: BuddyFilters
): T[] {
  const selectedGoals = filters.goals;
  if (selectedGoals.length === 0) {
    return buddies;
  }
  return buddies.filter((buddy) =>
    buddy.goals.some((goal) => selectedGoals.includes(goal))
  );
}
