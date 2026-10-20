import { Stack } from "expo-router";

/**
 * The workout stack.
 *
 * The list is the Workouts tab; "Add exercise" and "New workout"
 * push on top of it so the back gesture returns to the list.
 */
export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="workouthome" />
      <Stack.Screen name="add-exercise" />
      <Stack.Screen name="add-workout" />
    </Stack>
  );
}
