import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { supabase } from "../../../../utils/supabase";

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
      style={styles.container}
      contentContainerStyle={styles.content}>
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
        <Text style={styles.eyebrow}>YOUR FITNESS</Text>
        <Text style={styles.title}>My Workouts</Text>
        <Text style={styles.subtitle}>
          Add exercises, then combine them into a workout.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.primaryButton}
          onPress={handleAddExercise}>
          <Text style={styles.buttonPlus}>+</Text>
          <Text style={styles.primaryButtonText}>
            Add Exercise
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={handleCreateWorkout}>
          <Text style={styles.secondaryButtonText}>
            Create Workout
          </Text>
        </Pressable>
      </View>

      {/* Exercises section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Exercises</Text>
        <Text style={styles.sectionCount}>
          {exercises.length} saved
        </Text>
      </View>

      {loading ? (
        <View style={styles.emptyCard}>
          <ActivityIndicator />
        </View>
      ) : exercises.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>+</Text>
          </View>

          <Text style={styles.emptyTitle}>
            No exercises yet
          </Text>
          <Text style={styles.emptyText}>
            Add exercises like Squats, Bench Press, or Running.
            You can choose them later when creating a workout.
          </Text>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseIconBox}>
                <Text style={styles.exerciseIcon}>✣</Text>
              </View>

              <View style={styles.exerciseText}>
                <Text style={styles.exerciseName}>
                  {exercise.exercise_name}
                </Text>
                {exercise.exercise_category ? (
                  <Text style={styles.exerciseCategory}>
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
        <Text style={styles.sectionTitle}>
          Created Workouts
        </Text>
        <Text style={styles.sectionCount}>0 workouts</Text>
      </View>

      <View style={styles.emptyCard}>
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
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0"
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 32
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  logoIcon: {
    color: "#154734",
    fontSize: 25,
    marginRight: 7
  },
  logo: {
    color: "#154734",
    fontSize: 22,
    fontWeight: "800"
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#BD8013",
    marginLeft: 7,
    marginTop: 5
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#BD8013",
    backgroundColor: "#D7DDDA",
    alignItems: "center",
    justifyContent: "center"
  },
  profileHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    marginBottom: 2
  },
  profileBody: {
    width: 27,
    height: 15,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: "#FFFFFF"
  },

  headingSection: {
    marginBottom: 22
  },
  eyebrow: {
    color: "#789F90",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1
  },
  title: {
    color: "#154734",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 7,
    lineHeight: 20
  },

  buttonRow: {
    gap: 12,
    marginBottom: 30
  },
  primaryButton: {
    backgroundColor: "#154734",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonPlus: {
    color: "#FFFFFF",
    fontSize: 24,
    marginRight: 8,
    marginTop: -2
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryButton: {
    backgroundColor: "#DCEBE5",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: "#154734",
    fontSize: 16,
    fontWeight: "800"
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11
  },
  sectionTitle: {
    color: "#154734",
    fontSize: 19,
    fontWeight: "800"
  },
  sectionCount: {
    color: "#789F90",
    fontSize: 13,
    fontWeight: "700"
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 27
  },
  emptyIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#E6EFEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  emptyIcon: {
    color: "#154734",
    fontSize: 23,
    fontWeight: "700"
  },
  emptyTitle: {
    color: "#154734",
    fontSize: 16,
    fontWeight: "800"
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6
  },
  exerciseList: {
    gap: 10,
    marginBottom: 27
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#E6EFEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13
  },
  exerciseIcon: {
    color: "#154734",
    fontSize: 19,
    fontWeight: "700"
  },
  exerciseText: {
    flex: 1
  },
  exerciseName: {
    color: "#154734",
    fontSize: 16,
    fontWeight: "800"
  },
  exerciseCategory: {
    color: "#789F90",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2
  }
});
