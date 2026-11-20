import { filterBuddies } from "./buddyFilters";

// The screen has no workout-type filter, so this uses "Gym goals",
// stored in buddy-filters.tsx as `goals: string[]`.
test("filters buddies by goal", () => {
  // Arrange
  const buddies = [
    {
      id: 1,
      name: "Alex",
      age: 20,
      major: "Biology",
      gender: "Women",
      goals: ["Build muscle", "Stay active"],
      availability: ["Morning"]
    },
    {
      id: 2,
      name: "Sam",
      age: 22,
      major: "Computer Science",
      gender: "Men",
      goals: ["Build muscle"],
      availability: ["Evening"]
    },
    {
      id: 3,
      name: "Jordan",
      age: 21,
      major: "History",
      gender: "Non-binary",
      goals: ["Improve endurance"],
      availability: ["Weekends"]
    }
  ];

  // Same shape and names as the state in buddy-filters.tsx.
  // Empty values mean "any".
  const filters = {
    minAge: "",
    maxAge: "",
    major: "",
    goals: ["Build muscle"],
    genders: [],
    availability: []
  };

  // Act
  const result = filterBuddies(buddies, filters);

  // Assert
  expect(result).toEqual([buddies[0], buddies[1]]);
});
