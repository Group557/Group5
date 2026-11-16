import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import PolyFitLogo from "@/components/ui/PolyFitLogo";
import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";

export default function WorkoutHomePage() {
  const handleCreateWorkout = () => {
    router.push("/workout/add-workout");
  };

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={globalStyles.screenContent}>
      {/* Top bar */}
      <View style={[globalStyles.topBar, styles.topBar]}>
        <PolyFitLogo />

        <View style={styles.profileCircle}>
          <View style={styles.profileHead} />
          <View style={styles.profileBody} />
        </View>
      </View>

      {/* Heading */}
      <View style={styles.headingSection}>
        <Text style={globalStyles.eyebrow}>YOUR FITNESS</Text>
        <Text style={globalStyles.pageTitle}>My Workouts</Text>
        <Text style={globalStyles.subtitle}>
          Add exercises, then combine them into a workout
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            globalStyles.primaryButton,
            pressed && globalStyles.pressed
          ]}
          onPress={handleCreateWorkout}>
          <Text style={globalStyles.primaryButtonText}>
            Create Workout
          </Text>
        </Pressable>
      </View>

      {/* Workouts section */}
      <View style={globalStyles.sectionHeader}>
        <Text style={globalStyles.sectionTitle}>Workouts</Text>
        <Text style={styles.sectionCount}>0 workouts</Text>
      </View>

      <View style={[globalStyles.card, styles.emptyCard]}>
        <View style={styles.emptyIconBox}>
          <Text style={styles.emptyIcon}>✓</Text>
        </View>

        <Text style={styles.emptyTitle}>
          No workouts created
        </Text>
        <Text style={styles.emptyText}>
          After adding exercises, create a workout and select
          the exercises or add your own!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  topBar: {
    marginBottom: 30
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: palette.gold,
    backgroundColor: palette.avatar,
    alignItems: "center",
    justifyContent: "center"
  },
  profileHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.surface,
    marginBottom: 2
  },
  profileBody: {
    width: 27,
    height: 15,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: palette.surface
  },

  headingSection: {
    marginBottom: 22
  },

  buttonRow: {
    gap: 12,
    marginBottom: 30
  },

  sectionCount: {
    color: palette.sage,
    fontSize: 13,
    fontWeight: "700"
  },
  emptyCard: {
    alignItems: "center",
    marginBottom: 27
  },
  emptyIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: palette.surfaceSage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  emptyIcon: {
    color: palette.forest,
    fontSize: 23,
    fontWeight: "700"
  },
  emptyTitle: {
    color: palette.forest,
    fontSize: 16,
    fontWeight: "800"
  },
  emptyText: {
    color: palette.inkMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6
  }
});
