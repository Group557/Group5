import { useAuth } from "@/context/AuthProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { supabase } from "../../../../../utils/supabase";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";
import {
  getWorkoutExerciseVisibility,
  toggleWorkoutExerciseVisibility
} from "@/utils/workoutExerciseVisibility";

type SavedSet = {
  id: number;
  position: number;
  reps: number;
  weight: number;
};

type SavedWorkoutExercise = {
  id: number;
  position: number;
  exercise: {
    exercise_name: string;
  } | null;
  sets: SavedSet[];
};

type SavedWorkout = {
  id: number;
  workout_name: string;
  performed_at: string;
  weight_unit: string;
  exercises: SavedWorkoutExercise[];
};

function calculateVolume(workout: SavedWorkout): number {
  return workout.exercises.reduce(
    (workoutTotal, exercise) =>
      workoutTotal +
      exercise.sets.reduce(
        (exerciseTotal, set) =>
          exerciseTotal + set.reps * Number(set.weight),
        0
      ),
    0
  );
}

export default function WorkoutHomePage() {
  // State to track which workout is being deleted
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<
    number | null
  >(null);
  const deleteInProgress = useRef(false);

  // State to track which workouts are expanded
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<
    Record<number, boolean>
  >({});

  const { session } = useAuth();
  const userId = session?.user.id;
  // State to track workouts, loading state, and errors
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadWorkouts() {
        setLoading(true);
        setLoadError("");
        setWorkouts([]);

        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          const { data, error } = await supabase
            .from("workouts")
            .select(
              `
              id,
              workout_name,
              performed_at,
              weight_unit,
              exercises:workout_exercises (
                id,
                position,
                exercise:exercises (
                  exercise_name
                ),
                sets:workout_sets (
                  id,
                  position,
                  reps,
                  weight
                )
              )
            `
            )
            .eq("user_id", userId)
            .order("performed_at", { ascending: false })
            .order("id", { ascending: false })
            .returns<SavedWorkout[]>();

          if (!active) return;

          if (error) {
            setLoadError(error.message);
            return;
          }

          const sortedWorkouts = (data ?? []).map(
            (workout) => ({
              ...workout,
              exercises: [...workout.exercises].sort(
                (a, b) => a.position - b.position
              )
            })
          );

          setWorkouts(sortedWorkouts);
        } catch {
          if (active) {
            setLoadError(
              "Unable to load workouts. Please try again."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void loadWorkouts();

      return () => {
        active = false;
      };
    }, [userId, reloadKey])
  );

  const handleCreateWorkout = () => {
    router.push("/workout/add-workout");
  };

  const toggleExercises = (workoutId: number) => {
    setExpandedWorkoutIds((current) =>
      toggleWorkoutExerciseVisibility(current, workoutId)
    );
  };

  const deleteWorkout = async (workout: SavedWorkout) => {
    if (!userId || deleteInProgress.current) return;

    deleteInProgress.current = true;
    setDeletingWorkoutId(workout.id);

    try {
      const { data, error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workout.id)
        .eq("user_id", userId)
        .select("id");

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.length) {
        throw new Error(
          "This workout could not be deleted. Refresh and try again."
        );
      }

      setWorkouts((current) =>
        current.filter((item) => item.id !== workout.id)
      );

      setExpandedWorkoutIds((current) => {
        const updated = { ...current };
        delete updated[workout.id];
        return updated;
      });
    } catch (error) {
      Alert.alert(
        "Could not delete workout",
        error instanceof Error
          ? error.message
          : "Please try again."
      );
    } finally {
      deleteInProgress.current = false;
      setDeletingWorkoutId(null);
    }
  };

  const confirmDeleteWorkout = (workout: SavedWorkout) => {
    Alert.alert(
      "Delete workout?",
      `Delete "${workout.workout_name}" and its recorded sets? This cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteWorkout(workout);
          }
        }
      ]
    );
  };

  const openWorkoutMenu = (workout: SavedWorkout) => {
    if (deleteInProgress.current) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: workout.workout_name,
          options: ["Cancel", "Delete workout"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            confirmDeleteWorkout(workout);
          }
        }
      );
    } else {
      confirmDeleteWorkout(workout);
    }
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
        <Text style={styles.sectionCount}>
          {loading || loadError
            ? "—"
            : `${workouts.length} workouts`}
        </Text>
      </View>

      {loading ? (
        <Text style={globalStyles.bodyText}>
          Loading workouts...
        </Text>
      ) : loadError ? (
        <View>
          <Text style={{ color: palette.danger }}>
            {loadError}
          </Text>

          <Pressable
            onPress={() =>
              setReloadKey((current) => current + 1)
            }
            accessibilityRole="button"
            style={globalStyles.secondaryButton}>
            <Text style={globalStyles.secondaryButtonText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : workouts.length === 0 ? (
        <Text style={globalStyles.bodyText}>
          No completed workouts yet.
        </Text>
      ) : (
        workouts.map((workout) => {
          const expanded =
            expandedWorkoutIds[workout.id] ?? false;

          const {
            visibleExercises,
            canViewMore,
            hiddenExerciseCount
          } = getWorkoutExerciseVisibility(
            workout.exercises,
            expanded
          );

          const volume = calculateVolume(workout);

          const formattedDate = new Date(
            workout.performed_at
          ).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          });

          return (
            <View
              key={workout.id}
              style={[globalStyles.card, styles.workoutCard]}>
              <Text style={styles.workoutDate}>
                {formattedDate}
              </Text>
              {/* Workout header with name and menu button */}
              <View style={styles.workoutHeader}>
                <Text style={[styles.workoutName, { flex: 1 }]}>
                  {workout.workout_name}
                </Text>
                {/* Menu button for workout options, currently for deleting */}
                <Pressable
                  onPress={() => openWorkoutMenu(workout)}
                  disabled={deletingWorkoutId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Options for ${workout.workout_name}`}
                  accessibilityState={{
                    disabled: deletingWorkoutId !== null
                  }}
                  style={({ pressed }) => [
                    styles.workoutMenuButton,
                    pressed && globalStyles.pressed,
                    deletingWorkoutId !== null && {
                      opacity: 0.4
                    }
                  ]}>
                  <Text style={styles.workoutMenuIcon}>⋮</Text>
                </Pressable>
              </View>

              {deletingWorkoutId === workout.id && (
                <Text style={styles.workoutDate}>
                  Deleting...
                </Text>
              )}

              <Text style={styles.workoutVolume}>
                Total volume:{" "}
                {volume.toLocaleString("en-US", {
                  maximumFractionDigits: 2
                })}{" "}
                {workout.weight_unit}
              </Text>

              <View style={styles.exerciseList}>
                {visibleExercises.map((exercise) => (
                  <View
                    key={exercise.id}
                    style={styles.exerciseRow}>
                    <Text style={styles.exerciseName}>
                      {exercise.exercise?.exercise_name ??
                        "Exercise unavailable"}
                    </Text>

                    <Text style={styles.exerciseSets}>
                      {exercise.sets.length}{" "}
                      {exercise.sets.length === 1
                        ? "set"
                        : "sets"}
                    </Text>
                  </View>
                ))}
              </View>

              {canViewMore ? (
                <Pressable
                  style={styles.viewMoreButton}
                  onPress={() => toggleExercises(workout.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  accessibilityLabel={
                    expanded
                      ? `Show fewer exercises for ${workout.workout_name}`
                      : `Show all exercises for ${workout.workout_name}`
                  }>
                  <Text style={styles.viewMoreText}>
                    {expanded
                      ? "View less"
                      : `View more (${hiddenExerciseCount})`}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          );
        })
      )}
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
  },
  workoutCard: {
    marginBottom: 16
  },
  workoutDate: {
    color: palette.inkMuted,
    fontSize: 13,
    marginBottom: 8
  },
  workoutName: {
    color: palette.forest,
    fontSize: 20,
    fontWeight: "800"
  },
  workoutVolume: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8
  },
  exerciseList: {
    marginTop: 16,
    gap: 12
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  exerciseName: {
    flex: 1,
    color: palette.ink,
    fontSize: 14
  },
  exerciseSets: {
    color: palette.inkMuted,
    fontSize: 13
  },
  viewMoreButton: {
    paddingVertical: 12,
    marginTop: 8,
    alignItems: "center"
  },
  viewMoreText: {
    color: palette.forest,
    fontSize: 14,
    fontWeight: "700"
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  workoutMenuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  workoutMenuIcon: {
    fontSize: 28,
    color: palette.forest
  }
});
