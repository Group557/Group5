import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";
import { useWorkoutDraft } from "@/context/WorkoutDraftProvider";
import { supabase } from "../../../../../utils/supabase";

// Move CATEGORIES here.
const CATEGORIES = [
  "Cardio / Aerobic",
  "Strength / Resistance",
  "HIIT",
  "Flexibility / Mobility",
  "Balance / Stability",
  "Circuit",
  "Other"
];

export default function WorkoutDetailsScreen() {
  const {
    workoutName,
    setWorkoutName,
    category,
    setCategory,
    description,
    setDescription,
    addedExercises,
    resetDraft,
    requestId
  } = useWorkoutDraft();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const insets = useSafeAreaInsets();
  const [categoryOpen, setCategoryOpen] = useState(false);

  const validateWorkout = (): string | null => {
    if (!workoutName.trim()) {
      return "Please enter a workout name.";
    }

    if (category && !CATEGORIES.includes(category)) {
      return "Please select a valid category.";
    }

    if (addedExercises.length === 0) {
      return "Please add at least one exercise.";
    }

    for (const exercise of addedExercises) {
      if (exercise.sets.length === 0) {
        return `${exercise.exercise_name} needs at least one set.`;
      }

      for (const [index, set] of exercise.sets.entries()) {
        const label = `${exercise.exercise_name}, set ${index + 1}`;
        const repsText = set.reps.trim();
        const weightText = set.weight.trim();

        const reps = Number(repsText);
        const weight = Number(weightText);

        if (
          !/^\d+$/.test(repsText) ||
          !Number.isSafeInteger(reps) ||
          reps <= 0
        ) {
          return `${label}: enter a positive whole number for reps.`;
        }

        if (
          !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(weightText) ||
          !Number.isFinite(weight) ||
          weight < 0
        ) {
          return `${label}: enter a weight of 0 or more in pounds.`;
        }
      }
    }

    return null;
  };
  const handleSaveWorkout = async () => {
    const validationError = validateWorkout();

    if (validationError) {
      Alert.alert("Check your workout", validationError);
      return;
    }

    setSaving(true);
    setSaveError("");

    const exercises = addedExercises.map((exercise) => ({
      exercise_id: exercise.id,
      sets: exercise.sets.map((set) => ({
        reps: Number(set.reps),
        weight: Number(set.weight)
      }))
    }));

    const { data, error } = await supabase.rpc(
      "save_completed_workout",
      {
        p_request_id: requestId,
        p_name: workoutName.trim(),
        p_exercises: exercises,
        p_category: category || null,
        p_notes: description.trim() || null
      }
    );

    setSaving(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    if (data == null) {
      setSaveError(
        "The workout was not saved. Please try again."
      );
      return;
    }

    resetDraft();
    router.replace("/workout");
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workout/add-workout");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={globalStyles.screenContent}
        keyboardShouldPersistTaps="handled">
        <Pressable style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={globalStyles.pageTitle}>
          Workout Details
        </Text>

        <View style={styles.formCard}>
          <Text style={globalStyles.label}>Workout name</Text>
          <TextInput
            style={globalStyles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Example: Push Day"
          />

          <Text style={globalStyles.label}>Category</Text>
          <Pressable
            style={globalStyles.input}
            onPress={() => setCategoryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Select workout category">
            <Text style={styles.categoryText}>
              {category || "Select a category"}
            </Text>
          </Pressable>

          <Text style={globalStyles.label}>
            Notes (optional)
          </Text>
          <TextInput
            style={[globalStyles.input, styles.notesInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Workout notes"
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={[
            globalStyles.primaryButton,
            styles.checkButton,
            saving && { opacity: 0.6 }
          ]}
          onPress={handleSaveWorkout}
          disabled={saving}
          accessibilityRole="button">
          <Text style={globalStyles.primaryButtonText}>
            {saving ? "Saving..." : "Save Workout"}
          </Text>
        </Pressable>

        {saveError ? (
          <Text style={styles.saveErrorText}>{saveError}</Text>
        ) : null}
      </ScrollView>

      <Modal
        visible={categoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={globalStyles.sectionTitle}>
              Select a category
            </Text>

            {CATEGORIES.map((option) => (
              <Pressable
                key={option}
                style={styles.categoryOption}
                onPress={() => {
                  setCategory(option);
                  setCategoryOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{
                  selected: category === option
                }}>
                <Text style={styles.categoryText}>
                  {category === option ? "✓ " : ""}
                  {option}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.categoryOption}
              onPress={() => setCategoryOpen(false)}
              accessibilityRole="button">
              <Text style={styles.categoryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 28
  },
  backText: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  formCard: {
    marginTop: 16,
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12
  },
  categoryText: {
    color: palette.ink,
    fontSize: 15
  },
  notesInput: {
    minHeight: 100
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(21, 71, 52, 0.35)",
    justifyContent: "center",
    padding: 24
  },
  modalCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 18
  },
  categoryOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.lineSoft
  },
  checkButton: {
    marginTop: 24
  },
  saveErrorText: {
    color: palette.danger,
    marginTop: 12,
    textAlign: "center"
  }
});
