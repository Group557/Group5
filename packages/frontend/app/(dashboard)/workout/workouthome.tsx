import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from "react-native";

import { supabase } from "../../../../../utils/supabase";
import {
  BrandMark,
  Button,
  EmptyState,
  Icon,
  Screen,
  colors,
  radius,
  space,
  typography
} from "../../../theme";

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
    <Screen scroll edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <BrandMark />
      </View>

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>YOUR FITNESS</Text>
        <Text style={styles.title}>My Workouts</Text>
        <Text style={styles.subtitle}>
          Add exercises, then combine them into a workout.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Add Exercise"
          icon={{
            ios: "plus",
            android: "add",
            web: "add"
          }}
          onPress={handleAddExercise}
        />
        <Button
          label="Create Workout"
          variant="secondary"
          onPress={handleCreateWorkout}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Exercises</Text>
          <Text style={styles.sectionCount}>
            {exercises.length} saved
          </Text>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.forest} />
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.panel}>
            <EmptyState
              icon={{
                ios: "dumbbell",
                android: "fitness_center",
                web: "fitness_center"
              }}
              title="No exercises yet"
              body="Add exercises like Squats, Bench Press, or Running. You can choose them later when creating a workout."
            />
          </View>
        ) : (
          <View style={styles.list}>
            {exercises.map((exercise) => (
              <View key={exercise.id} style={styles.card}>
                <View style={styles.iconBox}>
                  <Icon
                    name={{
                      ios: "dumbbell",
                      android: "fitness_center",
                      web: "fitness_center"
                    }}
                    size={18}
                    color={colors.forest}
                    weight="regular"
                  />
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.name} numberOfLines={1}>
                    {exercise.exercise_name}
                  </Text>
                  {exercise.exercise_category ? (
                    <Text
                      style={styles.category}
                      numberOfLines={1}>
                      {exercise.exercise_category}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Created Workouts
          </Text>
          <Text style={styles.sectionCount}>0 workouts</Text>
        </View>

        <View style={styles.panel}>
          <EmptyState
            icon={{
              ios: "list.bullet.clipboard",
              android: "assignment",
              web: "assignment"
            }}
            title="No workouts created"
            body="After adding exercises, create a workout and select the exercises that belong in it."
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: space.sm,
    paddingBottom: space.xxl
  },
  heading: {
    marginBottom: space.xl
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.sage
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    marginTop: space.xs
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.inkMuted,
    marginTop: space.xs
  },

  actions: {
    gap: space.md,
    marginBottom: space.xxl
  },

  section: {
    marginBottom: space.xxl
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.md
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink
  },
  sectionCount: {
    ...typography.captionStrong,
    color: colors.sage
  },

  loading: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: space.xxl,
    alignItems: "center"
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: space.sm
  },
  list: {
    gap: space.sm
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    flexDirection: "row",
    alignItems: "center"
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md
  },
  cardText: {
    flex: 1,
    minWidth: 0
  },
  name: {
    ...typography.body,
    fontWeight: "700",
    color: colors.ink
  },
  category: {
    ...typography.caption,
    color: colors.sage,
    marginTop: 2
  }
});
