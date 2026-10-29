import { Stack } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Text,
  View
} from "react-native";
import AuthProvider, { useAuth } from "../context/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}

function AppNavigation() {
  const { session, onboarded, loading, error, refreshProfile } =
    useAuth();

  // Wait until the provider finishes checking.
  if (loading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading your account...</Text>
      </View>
    );
  }

  // Don't choose a protected route without a known profile status.
  if (error || (session !== null && onboarded === null)) {
    return (
      <View>
        <Text>
          {error ?? "Unable to determine onboarding status."}
        </Text>
        <Button
          title="Try again"
          onPress={() => {
            void refreshProfile();
          }}
        />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={session === null}>
        <Stack.Screen name="(login-registration)" />
      </Stack.Protected>

      <Stack.Protected
        guard={session !== null && onboarded === false}>
        <Stack.Screen name="(onboarding)/onboard" />
      </Stack.Protected>

      <Stack.Protected
        guard={session !== null && onboarded === true}>
        <Stack.Screen name="(Home)/homepage" />
      </Stack.Protected>
      <Stack.Protected
        guard={session !== null && onboarded === true}>
        <Stack.Screen name="(Home)/rec-center" />
      </Stack.Protected>
      <Stack.Protected
        guard={session !== null && onboarded === true}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
