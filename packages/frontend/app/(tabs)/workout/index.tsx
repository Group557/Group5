import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import ScreenHeader from "@/components/ui/ScreenHeader";
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
      <ScreenHeader
        eyebrow="TRAINING HUB"
        title="My Workouts"
        subtitle="Create and organize your workouts"
      />

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
          Add excercises to create your workout routine!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
