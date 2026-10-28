import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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

import { supabase } from "../../../../utils/supabase";

const CATEGORIES = [
  "Cardio / Aerobic",
  "Strength / Resistance",
  "HIIT",
  "Flexibility / Mobility",
  "Balance / Stability",
  "Circuit",
  "Other"
];

type Exercise = {
  id: number;
  exercise_name: string;
  exercise_category: string | null;
  is_favorite: boolean;
};

// Normalize text so spelling differences don't matter.
function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function AddWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState("");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] =
    useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(
    null
  );
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const loadExercises = useCallback(async () => {
    const { data, error } = await supabase
      .from("exercises")
      .select(
        "id, exercise_name, exercise_category, is_favorite"
      )
      .order("exercise_name", { ascending: true });

    if (error) {
      console.log("Could not load exercises:", error.message);
    } else {
      setExercises(data ?? []);
    }
    setLoadingExercises(false);
  }, []);

  const openLibrary = () => {
    // Reset the view so the library always starts fresh, then load.
    setFilter("all");
    setSearchQuery("");
    setSelectedFilterCategory("");
    setExpandedId(null);
    setLoadingExercises(true);
    setLibraryOpen(true);
    void loadExercises();
  };

  const toggleFavorite = async (exercise: Exercise) => {
    const next = !exercise.is_favorite;

    // Update the UI immediately so the heart feels responsive.
    setExercises((current) =>
      current.map((item) =>
        item.id === exercise.id
          ? { ...item, is_favorite: next }
          : item
      )
    );

    const { error } = await supabase
      .from("exercises")
      .update({ is_favorite: next })
      .eq("id", exercise.id);

    if (error) {
      console.log("Could not update favorite:", error.message);
      // Roll back if the save failed.
      setExercises((current) =>
        current.map((item) =>
          item.id === exercise.id
            ? { ...item, is_favorite: !next }
            : item
        )
      );
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const toggleAdded = (id: number) => {
    setAddedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  };

  const addedExercises = exercises.filter((exercise) =>
    addedIds.includes(exercise.id)
  );

  const visibleExercises = exercises.filter((exercise) => {
    if (filter === "favorites" && !exercise.is_favorite) {
      return false;
    }

    if (selectedFilterCategory) {
      const target = normalize(selectedFilterCategory);
      const value = normalize(exercise.exercise_category ?? "");
      if (!value.includes(target)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const query = normalize(searchQuery);
      const name = normalize(exercise.exercise_name);
      if (!name.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workouthome");
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
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>New Workout</Text>
        <Text style={styles.subtitle}>
          Name your workout, then select saved exercises from
          your library to include.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Workout name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Leg Day"
            placeholderTextColor="#9CA3AF"
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.select}
            onPress={() => setCategoryOpen(true)}>
            <Text
              style={
                category
                  ? styles.selectValue
                  : styles.selectPlaceholder
              }>
              {category || "Select a category"}
            </Text>
            <Text style={styles.selectChevron}>⌄</Text>
          </Pressable>

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Example: Glute focused lower body"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Exercises</Text>

          {addedExercises.length === 0 ? (
            <Text style={styles.addedEmptyText}>
              No exercises added yet. Tap Browse your exercises
              below to add some.
            </Text>
          ) : (
            addedExercises.map((exercise, index) => (
              <View
                key={exercise.id}
                style={[
                  styles.addedRow,
                  index === 0 && styles.addedRowFirst
                ]}>
                <View style={styles.exerciseRowText}>
                  <Text style={styles.exerciseName}>
                    {exercise.exercise_name}
                  </Text>
                  {exercise.exercise_category ? (
                    <Text style={styles.exerciseCategory}>
                      {exercise.exercise_category}
                    </Text>
                  ) : null}
                </View>

                <Pressable
                  hitSlop={8}
                  onPress={() => toggleAdded(exercise.id)}>
                  <Text style={styles.addedRemove}>✕</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={styles.browseBlock}
          onPress={openLibrary}>
          <View style={styles.browseCardText}>
            <Text style={styles.browseBlockTitle}>
              Browse your exercises
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

      <Modal
        visible={libraryOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setLibraryOpen(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setLibraryOpen(false)}>
          <Pressable
            style={styles.libraryCard}
            onPress={() => {}}>
            <View style={styles.libraryHeader}>
              <Text style={styles.modalTitle}>
                Exercise Library
              </Text>
              <Pressable onPress={() => setLibraryOpen(false)}>
                <Text style={styles.libraryClose}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.libraryControls}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.filterRow}>
                <Pressable
                  style={[
                    styles.filterButton,
                    filter === "favorites" &&
                      styles.filterButtonActive
                  ]}
                  onPress={() => {
                    const turningOn = filter !== "favorites";
                    setFilter(turningOn ? "favorites" : "all");
                    if (turningOn) {
                      // Favorites should always show every favorite,
                      // so clear any category or search that could hide them.
                      setSelectedFilterCategory("");
                      setSearchQuery("");
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      filter === "favorites" &&
                        styles.filterButtonTextActive
                    ]}>
                    ❤️ Favorites
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.filterButton}
                  onPress={() => setFilterOpen(true)}>
                  <Text style={styles.filterButtonText}>
                    {selectedFilterCategory
                      ? selectedFilterCategory
                      : "Filter"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <ScrollView
              style={styles.libraryList}
              contentContainerStyle={styles.libraryListContent}>
              {loadingExercises ? (
                <View style={styles.libraryEmpty}>
                  <ActivityIndicator />
                </View>
              ) : (
                visibleExercises.map((exercise) => {
                  const isExpanded = expandedId === exercise.id;
                  const isAdded = addedIds.includes(
                    exercise.id
                  );
                  return (
                    <View
                      key={exercise.id}
                      style={[
                        styles.exerciseRow,
                        exercise.is_favorite &&
                          styles.exerciseRowFavorite
                      ]}>
                      <View style={styles.exerciseRowMain}>
                        <Pressable
                          style={styles.exerciseRowText}
                          onPress={() =>
                            toggleExpanded(exercise.id)
                          }>
                          <Text style={styles.exerciseName}>
                            {exercise.exercise_name}
                          </Text>
                          {exercise.exercise_category ? (
                            <Text
                              style={styles.exerciseCategory}>
                              {exercise.exercise_category}
                            </Text>
                          ) : null}
                        </Pressable>

                        <Pressable
                          hitSlop={8}
                          onPress={() =>
                            toggleFavorite(exercise)
                          }>
                          <Text style={styles.heartText}>
                            {exercise.is_favorite ? "❤️" : "🤍"}
                          </Text>
                        </Pressable>
                      </View>

                      {isExpanded ? (
                        <Pressable
                          style={[
                            styles.addToWorkoutButton,
                            isAdded &&
                              styles.addToWorkoutButtonAdded
                          ]}
                          onPress={() =>
                            toggleAdded(exercise.id)
                          }>
                          <Text
                            style={[
                              styles.addToWorkoutText,
                              isAdded &&
                                styles.addToWorkoutTextAdded
                            ]}>
                            {isAdded
                              ? "✓ Added to Workout"
                              : "+ Add to Workout"}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.libraryFooter}>
              {!loadingExercises ? (
                <Pressable
                  style={styles.addExerciseLink}
                  onPress={() => {
                    setLibraryOpen(false);
                    router.push("/add-exercise");
                  }}>
                  <Text style={styles.addExerciseLinkText}>
                    + Add an Exercise
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                style={styles.doneButton}
                onPress={() => setLibraryOpen(false)}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterOpen(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setFilterOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Filter by category
            </Text>

            {["Upper body", "Lower body", "Cardio"].map(
              (option) => (
                <Pressable
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedFilterCategory(option);
                    setFilter("all");
                    setFilterOpen(false);
                  }}>
                  <Text
                    style={
                      selectedFilterCategory === option
                        ? styles.modalOptionTextActive
                        : styles.modalOptionText
                    }>
                    {option}
                  </Text>
                </Pressable>
              )
            )}

            {selectedFilterCategory ? (
              <Pressable
                style={styles.modalOption}
                onPress={() => {
                  setSelectedFilterCategory("");
                  setFilterOpen(false);
                }}>
                <Text style={styles.modalOptionText}>
                  Clear filter
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F8F6F0"
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36
  },
  backButton: {
    marginBottom: 28
  },
  backText: {
    color: "#154734",
    fontSize: 16,
    fontWeight: "700"
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
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 22
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18
  },
  label: {
    color: "#154734",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#DCEBE5",
    borderRadius: 11,
    backgroundColor: "#FAFCFA",
    color: "#154734",
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 12
  },
  notesInput: {
    height: 64
  },
  select: {
    borderWidth: 1,
    borderColor: "#DCEBE5",
    borderRadius: 11,
    backgroundColor: "#FAFCFA",
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selectValue: {
    color: "#154734",
    fontSize: 15
  },
  selectPlaceholder: {
    color: "#9CA3AF",
    fontSize: 15
  },
  selectChevron: {
    color: "#154734",
    fontSize: 18,
    marginTop: -4
  },
  browseBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  browseBlockTitle: {
    color: "#154734",
    fontSize: 16,
    fontWeight: "800"
  },
  browseBlockHint: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4
  },
  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F2",
    paddingVertical: 12
  },
  addedRowFirst: {
    paddingTop: 0
  },
  addedRemove: {
    color: "#154734",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 6
  },
  addedEmptyText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    paddingBottom: 4
  },
  browseCardText: {
    flex: 1
  },
  browseCardChevron: {
    color: "#154734",
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 12
  },
  libraryFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10
  },
  addExerciseLink: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#DCEBE5",
    alignItems: "center"
  },
  addExerciseLinkText: {
    color: "#154734",
    fontSize: 14,
    fontWeight: "800"
  },
  doneButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#154734",
    alignItems: "center"
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
  },
  saveButton: {
    backgroundColor: "#154734",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 8,
    shadowColor: "#154734",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3
  },
  saveButtonDisabled: {
    opacity: 0.6
  },
  saveErrorText: {
    color: "#B91C1C",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18
  },
  modalTitle: {
    color: "#154734",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8
  },
  modalOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F2"
  },
  modalOptionText: {
    color: "#154734",
    fontSize: 15
  },
  modalOptionTextActive: {
    color: "#154734",
    fontSize: 15,
    fontWeight: "800"
  },
  libraryCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "88%",
    flex: 1,
    marginTop: "auto"
  },
  libraryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10
  },
  libraryClose: {
    color: "#154734",
    fontSize: 20,
    paddingHorizontal: 8
  },
  libraryList: {
    flex: 1
  },
  libraryListContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16
  },
  libraryEmpty: {
    alignItems: "center",
    paddingVertical: 32
  },
  libraryControls: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 10
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#DCEBE5",
    borderRadius: 11,
    backgroundColor: "#FAFCFA",
    color: "#154734",
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  filterButton: {
    backgroundColor: "#DCEBE5",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  filterButtonActive: {
    backgroundColor: "#154734"
  },
  filterButtonText: {
    color: "#154734",
    fontSize: 13,
    fontWeight: "700"
  },
  filterButtonTextActive: {
    color: "#FFFFFF"
  },
  exerciseRow: {
    backgroundColor: "#F8FAF9",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10
  },
  exerciseRowFavorite: {
    backgroundColor: "#DCEBE5"
  },
  exerciseRowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  exerciseRowText: {
    flex: 1
  },
  addToWorkoutButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#154734",
    alignItems: "center"
  },
  addToWorkoutButtonAdded: {
    backgroundColor: "#FFFFFF"
  },
  addToWorkoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  addToWorkoutTextAdded: {
    color: "#154734"
  },
  exerciseName: {
    color: "#154734",
    fontSize: 15,
    fontWeight: "700"
  },
  exerciseCategory: {
    color: "#789F90",
    fontSize: 13,
    marginTop: 2
  },
  heartText: {
    fontSize: 18,
    marginLeft: 12
  }
});
