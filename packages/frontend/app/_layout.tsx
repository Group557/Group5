import { Stack } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthProvider, { useAuth } from "../context/AuthProvider";
import { Button, colors, space, typography } from "../theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppNavigation() {
  const { session, onboarded, loading, error, refreshProfile } =
    useAuth();

  // Wait until the provider finishes checking.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.forest} />
        <Text style={styles.centeredText}>
          Loading your account...
        </Text>
      </View>
    );
  }

  // Don't choose a protected route without a known profile status.
  if (error || (session !== null && onboarded === null)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>
        <Text style={styles.centeredText}>
          {error ?? "Unable to determine onboarding status."}
        </Text>

        <Button
          label="Try again"
          onPress={() => {
            void refreshProfile();
          }}
          style={styles.retry}
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
        <Stack.Screen name="(dashboard)" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
    padding: space.xl
  },
  centeredText: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: space.md
  },
  errorTitle: {
    ...typography.title,
    color: colors.ink
  },
  retry: {
    marginTop: space.xl,
    minWidth: 160
  }
});
