import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActionSheetIOS,
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
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AddExerciseModal, {
  type Exercise
} from "../../../components/workout/add_exercise_modal";

import { supabase } from "../../../../../utils/supabase";

type WorkoutSet = {
  id: string;
  reps: string;
  weight: string;
};
type WorkoutExercise = Exercise & {
  sets: WorkoutSet[];
};

const CATEGORIES = [
  "Cardio / Aerobic",
  "Strength / Resistance",
  "HIIT",
  "Flexibility / Mobility",
  "Balance / Stability",
  "Circuit",
  "Other"
];

export default function AddWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const nextSetId = useRef(1);
  const [workoutName, setWorkoutName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [addedExercises, setAddedExercises] = useState<
    WorkoutExercise[]
  >([]);
  const addedIds = addedExercises.map(
    (exercise) => exercise.id
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const updateSet = (
    exerciseId: number,
    setId: string,
    field: "reps" | "weight",
    value: string
  ) => {
    setAddedExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      })
    );
  };

  const addSet = (exerciseId: number) => {
    const newSet: WorkoutSet = {
      id: `added-${nextSetId.current}`,
      reps: "",
      weight: ""
    };

    nextSetId.current += 1;

    setAddedExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, newSet]
            }
          : exercise
      )
    );
  };
  const removeSet = (exerciseId: number, setId: string) => {
    setAddedExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter(
                (set) => set.id !== setId
              )
            }
          : exercise
      )
    );
  };

  const removeExercise = (exerciseId: number) => {
    setAddedExercises((current) =>
      current.filter((exercise) => exercise.id !== exerciseId)
    );
  };
  const openExerciseMenu = (exercise: WorkoutExercise) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: exercise.exercise_name,
          options: ["Cancel", "Delete"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            removeExercise(exercise.id);
          }
        }
      );
    } else {
      Alert.alert(exercise.exercise_name, "Exercise options", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeExercise(exercise.id)
        }
      ]);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workout");
    }
  };

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      setSaveError("Please name your workout first.");
      return;
    }

    setSaving(true);
    setSaveError("");

    // 1. Save the workout itself.
    const { data: workout, error: workoutError } =
      await supabase
        .from("workouts")
        .insert({
          workout_name: workoutName.trim(),
          workout_category: category || null,
          workout_notes: description || null
        })
        .select("id")
        .single();

    if (workoutError || !workout) {
      console.log(
        "Could not save workout:",
        workoutError?.message
      );
      setSaveError(
        workoutError
          ? `Could not save workout: ${workoutError.message}`
          : "Could not save workout. Please try again."
      );
      setSaving(false);
      return;
    }

    // 2. Save the exercises that were added to this workout.
    if (addedIds.length > 0) {
      const rows = addedIds.map((exerciseId) => ({
        workout_id: workout.id,
        exercise_id: exerciseId
      }));

      const { error: linkError } = await supabase
        .from("workout_exercises")
        .insert(rows);

      if (linkError) {
        console.log(
          "Could not save workout exercises:",
          linkError.message
        );
        setSaveError(
          `Workout saved, but exercises failed: ${linkError.message}`
        );
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={globalStyles.screenContent}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={globalStyles.pageTitle}>New Workout</Text>

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
            style={styles.select}
            onPress={() => setCategoryOpen(true)}>
            <Text style={styles.selectValue}>
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
            multiline
            placeholder="Workout notes"
          />
          <Text style={globalStyles.label}>Exercises</Text>
          {addedExercises.length === 0 ? (
            <Text style={styles.addedEmptyText}>
              Tap Add Exercise to choose from the library.
            </Text>
          ) : (
            addedExercises.map((exercise) => (
              <View key={exercise.id}>
                <View style={styles.addedRow}>
                  <Text style={styles.exerciseRowText}>
                    {exercise.exercise_name}
                  </Text>
                  <Pressable
                    style={styles.exerciseMenuButton}
                    onPress={() => openExerciseMenu(exercise)}
                    accessibilityRole="button"
                    accessibilityLabel={`Options for ${exercise.exercise_name}`}>
                    <Text style={styles.exerciseMenuText}>
                      ⋮
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.setRow}>
                  <Text style={styles.setNumber}>SETS</Text>
                  <Text style={styles.setField}>LBS</Text>
                  <Text style={styles.setField}>REPS</Text>
                </View>

                {exercise.sets.map((set, index) => (
                  <Swipeable
                    key={set.id}
                    friction={2}
                    rightThreshold={40}
                    overshootRight={false}
                    containerStyle={styles.swipeContainer}
                    renderRightActions={() => (
                      <Pressable
                        style={styles.deleteSetButton}
                        onPress={() =>
                          removeSet(exercise.id, set.id)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`Delete set ${index + 1}`}>
                        <Text style={styles.deleteSetText}>
                          Delete
                        </Text>
                      </Pressable>
                    )}>
                    <View
                      style={[
                        styles.setRow,
                        styles.swipeSetRow
                      ]}>
                      <Text style={styles.setNumber}>
                        {index + 1}
                      </Text>

                      <View style={styles.setField}>
                        <TextInput
                          style={globalStyles.input}
                          value={set.weight}
                          onChangeText={(value) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              "weight",
                              value
                            )
                          }
                          keyboardType="decimal-pad"
                          placeholder="0"
                          accessibilityLabel={`Set ${index + 1} weight in pounds`}
                        />
                      </View>

                      <View style={styles.setField}>
                        <TextInput
                          style={globalStyles.input}
                          value={set.reps}
                          onChangeText={(value) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              "reps",
                              value
                            )
                          }
                          keyboardType="number-pad"
                          placeholder="0"
                          accessibilityLabel={`Set ${index + 1} reps`}
                        />
                      </View>
                    </View>
                  </Swipeable>
                ))}
                <Pressable
                  style={styles.addSetButton}
                  onPress={() => addSet(exercise.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add set to ${exercise.exercise_name}`}>
                  <Text style={styles.addSetText}>
                    + Add Set
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={styles.browseBlock}
          onPress={() => setLibraryOpen(true)}>
          <View style={styles.browseCardText}>
            <Text style={styles.browseBlockTitle}>
              Add Exercise
            </Text>
            <Text style={styles.browseBlockHint}>
              Tap to open the Exercise Library
            </Text>
          </View>
          <Text style={styles.browseCardChevron}>›</Text>
        </Pressable>

        <Pressable
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled
          ]}
          disabled={saving}
          onPress={handleCreateWorkout}>
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Create Workout"}
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
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCategoryOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Select a category
            </Text>

            {CATEGORIES.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setCategory(option);
                  setCategoryOpen(false);
                }}>
                <Text
                  style={
                    category === option
                      ? styles.modalOptionTextActive
                      : styles.modalOptionText
                  }>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {libraryOpen ? (
        <AddExerciseModal
          selectedExercises={addedExercises}
          onClose={() => setLibraryOpen(false)}
          onConfirm={(selected) => {
            setAddedExercises((current) =>
              selected.map((exercise) => {
                const existing = current.find(
                  (item) => item.id === exercise.id
                );

                if (existing) {
                  return existing;
                }

                return {
                  ...exercise,
                  sets: [
                    {
                      id: "initial",
                      reps: "",
                      weight: ""
                    }
                  ]
                };
              })
            );

            setLibraryOpen(false);
          }}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerGap: {
    marginBottom: 22
  },
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
    padding: 18
  },
  notesInput: {
    height: 64
  },
  select: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 11,
    backgroundColor: palette.field,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selectValue: {
    color: palette.ink,
    fontSize: 15
  },
  browseBlock: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  browseBlockTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  browseBlockHint: {
    color: palette.inkMuted,
    fontSize: 13,
    marginTop: 4
  },
  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette.lineSoft,
    paddingVertical: 12
  },
  addedRemove: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 6
  },
  addedEmptyText: {
    color: palette.inkMuted,
    fontSize: 13,
    lineHeight: 19,
    paddingBottom: 4
  },
  browseCardText: {
    flex: 1
  },
  browseCardChevron: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 12
  },
  saveButton: {
    backgroundColor: palette.forest,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 8,
    shadowColor: palette.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  saveButtonText: {
    color: palette.onDark,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3
  },
  saveButtonDisabled: {
    opacity: 0.6
  },
  saveErrorText: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12
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
  modalTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8
  },
  modalOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: palette.lineSoft
  },
  modalOptionText: {
    color: palette.ink,
    fontSize: 15
  },
  modalOptionTextActive: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  exerciseRowText: {
    flex: 1
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  setField: {
    flex: 1,
    gap: 4
  },
  setNumber: {
    width: 48,
    textAlign: "center"
  },
  addSetButton: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: palette.surfaceSage,
    borderRadius: 8,
    marginBottom: 16
  },
  addSetText: {
    color: palette.forest,
    fontWeight: "700"
  },
  swipeContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden"
  },
  swipeSetRow: {
    marginBottom: 0,
    backgroundColor: palette.surface,
    paddingVertical: 4
  },
  deleteSetButton: {
    width: 80,
    backgroundColor: palette.danger,
    alignItems: "center",
    justifyContent: "center"
  },
  deleteSetText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  exerciseMenuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  exerciseMenuText: {
    color: palette.ink,
    fontSize: 26
  }
});
