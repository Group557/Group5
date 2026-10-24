import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#E4E3D3" },
        headerShadowVisible: false,
        headerTintColor: "#1F4A35",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="change-password" options={{ title: "Change Password" }} />
      <Stack.Screen name="change-measurements" options={{ title: "Change Measurements" }} />
    </Stack>
  );
}