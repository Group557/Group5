import { palette } from "@/constants/theme";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.chrome },
        headerShadowVisible: false,
        headerTintColor: palette.ink,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="change-password" options={{ title: "Change Password" }} />
      <Stack.Screen name="change-measurements" options={{ title: "Change Measurements" }} />
    </Stack>
  );
}