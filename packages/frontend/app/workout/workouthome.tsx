import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { supabase } from "../../../../utils/supabase";
import {
  buttons,
  cards,
  colors,
  layout,
  radius,
  space,
  text
} from "../../theme";

type Exercise = {
  id: number;
  exercise_name: string;
  exercise_category: string | null;
};

export default function WorkoutHomePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("exercises")
      .select("id, exercise_name, exercise_category")
      .order("exercise_name", { ascending: true });

    if (error) {
      console.log("Could not load exercises:", error.message);
    } else {
      setExercises(data ?? []);
    }
    setLoading(false);
  }, []);

  // Reload every time this screen comes into focus so newly
  // added exercises appear right away.
  useFocusEffect(
    useCallback(() => {
      void loadExercises();
    }, [loadExercises])
  );

  const handleAddExercise = () => {
    router.push("/workout/add-exercise");
  };

  const handleCreateWorkout = () => {
    router.push("/workout/add-workout");
  };

  return (
    <ScrollView
      style={layout.screen}
      contentContainerStyle={layout.scrollContent}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>✣</Text>
          <Text style={styles.logo}>PolyFit</Text>
          <View style={styles.logoDot} />
        </View>

        <View style={styles.profileCircle}>
          <View style={styles.profileHead} />
          <View style={styles.profileBody} />
        </View>
      </View>

      {/* Heading */}
      <View style={styles.headingSection}>
        <Text style={text.eyebrow}>YOUR FITNESS</Text>
        <Text style={text.screenTitle}>My Workouts</Text>
        <Text style={text.subtitle}>
          Add exercises, then combine them into a workout.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={buttons.primary}
          onPress={handleAddExercise}>
          <Text style={styles.buttonPlus}>+</Text>
          <Text style={buttons.primaryText}>
            Add Exercise
          </Text>
        </Pressable>

        <Pressable
          style={buttons.secondary}
          onPress={handleCreateWorkout}>
          <Text style={buttons.secondaryText}>
            Create Workout
          </Text>
        </Pressable>
      </View>

      {/* Exercises section */}
      <View style={styles.sectionHeader}>
        <Text style={text.sectionTitle}>My Exercises</Text>
        <Text style={text.sectionCount}>
          {exercises.length} saved
        </Text>
      </View>

      {loading ? (
        <View style={cards.empty}>
          <ActivityIndicator />
        </View>
      ) : exercises.length === 0 ? (
        <View style={cards.empty}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>+</Text>
          </View>

          <Text style={styles.emptyTitle}>No exercises yet</Text>
          <Text style={styles.emptyText}>
            Add exercises like Squats, Bench Press, or Running.
            You can choose them later when creating a workout.
          </Text>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={cards.item}>
              <View style={styles.exerciseIconBox}>
                <Text style={styles.exerciseIcon}>✣</Text>
              </View>

              <View style={styles.exerciseText}>
                <Text style={text.exerciseName}>
                  {exercise.exercise_name}
                </Text>
                {exercise.exercise_category ? (
                  <Text style={text.exerciseCategory}>
                    {exercise.exercise_category}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Workouts section */}
      <View style={styles.sectionHeader}>
        <Text style={text.sectionTitle}>
          Created Workouts
        </Text>
        <Text style={text.sectionCount}>0 workouts</Text>
      </View>

      <View style={cards.empty}>
        <View style={styles.emptyIconBox}>
          <Text style={styles.emptyIcon}>✓</Text>
        </View>

        <Text style={styles.emptyTitle}>
          No workouts created
        </Text>
        <Text style={styles.emptyText}>
          After adding exercises, create a workout and select
          the exercises that belong in it.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.xxxl
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  logoIcon: {
    color: colors.forest,
    fontSize: 25,
    marginRight: 7
  },
  logo: {
    color: colors.forest,
    fontSize: 22,
    fontWeight: "800"
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginLeft: 7,
    marginTop: 5
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.surfaceAvatar,
    alignItems: "center",
    justifyContent: "center"
  },
  profileHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surface,
    marginBottom: 2
  },
  profileBody: {
    width: 27,
    height: 15,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: colors.surface
  },

  headingSection: {
    marginBottom: space.xxl
  },

  buttonRow: {
    gap: space.md,
    marginBottom: space.xxxl
  },
  buttonPlus: {
    color: colors.onDark,
    fontSize: 24,
    marginRight: space.sm,
    marginTop: -2
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.md
  },

  emptyIconBox: {
    width: 45,
    height: 45,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  emptyIcon: {
    color: colors.forest,
    fontSize: 23,
    fontWeight: "700"
  },
  emptyTitle: {
    color: colors.forest,
    fontSize: 16,
    fontWeight: "800"
  },
  emptyText: {
    color: colors.inkMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6
  },
  exerciseList: {
    gap: 10,
    marginBottom: space.xxl
  },
  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13
  },
  exerciseIcon: {
    color: colors.forest,
    fontSize: 19,
    fontWeight: "700"
  },
  exerciseText: {
    flex: 1
  }
});
