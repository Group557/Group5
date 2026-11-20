import WorkoutDraftProvider from "@/context/WorkoutDraftProvider";
import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <WorkoutDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WorkoutDraftProvider>
  );
}
