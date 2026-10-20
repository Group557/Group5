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
import {
  buttons,
  cards,
  chips,
  colors,
  form,
  layout,
  modal,
  radius,
  sheet,
  space,
  text,
  typography
} from "../../theme";

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
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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
      router.replace("/workout/workouthome");
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
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        workout_name: workoutName.trim(),
        workout_category: category || null,
        workout_notes: description || null
      })
      .select("id")
      .single();

    if (workoutError || !workout) {
      console.log("Could not save workout:", workoutError?.message);
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
        console.log("Could not save workout exercises:", linkError.message);
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
      style={layout.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={layout.scrollContent}>
        <Pressable
          style={buttons.backLink}
          onPress={goBack}>
          <Text style={buttons.backText}>‹ Back</Text>
        </Pressable>

        <Text style={text.screenTitle}>New Workout</Text>
        <Text style={[text.subtitle, styles.subtitle]}>
          Name your workout, then select saved exercises from
          your library to include.
        </Text>

        <View style={cards.card}>
          <Text style={text.fieldLabel}>Workout name</Text>
          <TextInput
            style={form.input}
            placeholder="Example: Leg Day"
            placeholderTextColor={colors.inkPlaceholder}
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <Text style={text.fieldLabel}>Category</Text>
          <Pressable
            style={form.select}
            onPress={() => setCategoryOpen(true)}>
            <Text
              style={
                category
                  ? form.selectValue
                  : form.selectPlaceholder
              }>
              {category || "Select a category"}
            </Text>
            <Text style={form.selectChevron}>⌄</Text>
          </Pressable>

          <Text style={text.fieldLabel}>Notes (optional)</Text>
          <TextInput
            style={[form.input, styles.notesInput]}
            placeholder="Example: Glute focused lower body"
            placeholderTextColor={colors.inkPlaceholder}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={text.fieldLabel}>Exercises</Text>

          {addedExercises.length === 0 ? (
            <Text style={text.caption}>
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
                <View style={styles.rowText}>
                  <Text style={text.exerciseName}>
                    {exercise.exercise_name}
                  </Text>
                  {exercise.exercise_category ? (
                    <Text style={text.exerciseCategory}>
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
          style={[cards.card, styles.browseBlock]}
          onPress={openLibrary}>
          <View style={styles.browseCardText}>
            <Text style={text.cardTitle}>
              Browse your exercises
            </Text>
            <Text style={text.hint}>
              Tap to open the Exercise Library
            </Text>
          </View>
          <Text style={styles.browseCardChevron}>›</Text>
        </Pressable>

        <Pressable
          style={[
            buttons.primary,
            styles.createButton,
            saving && buttons.disabled
          ]}
          disabled={saving}
          onPress={handleCreateWorkout}>
          <Text style={styles.createButtonText}>
            {saving ? "Saving..." : "Create Workout"}
          </Text>
        </Pressable>

        {saveError ? (
          <Text style={text.error}>{saveError}</Text>
        ) : null}
      </ScrollView>

      <Modal
        visible={categoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryOpen(false)}>
        <Pressable
          style={modal.backdrop}
          onPress={() => setCategoryOpen(false)}>
          <View style={modal.card}>
            <Text style={modal.title}>
              Select a category
            </Text>

            {CATEGORIES.map((option) => (
              <Pressable
                key={option}
                style={modal.option}
                onPress={() => {
                  setCategory(option);
                  setCategoryOpen(false);
                }}>
                <Text
                  style={
                    category === option
                      ? modal.optionTextActive
                      : modal.optionText
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
          style={modal.backdrop}
          onPress={() => setLibraryOpen(false)}>
          <Pressable
            style={sheet.container}
            onPress={() => {}}>
            <View style={sheet.header}>
              <Text style={modal.title}>
                Exercise Library
              </Text>
              <Pressable onPress={() => setLibraryOpen(false)}>
                <Text style={sheet.close}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.libraryControls}>
              <TextInput
                style={[form.input, styles.searchInput]}
                placeholder="Search exercises..."
                placeholderTextColor={colors.inkPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.filterRow}>
                <Pressable
                  style={[
                    chips.chip,
                    filter === "favorites" &&
                      chips.chipActive
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
                      chips.chipText,
                      filter === "favorites" &&
                        chips.chipTextActive
                    ]}>
                    ❤️ Favorites
                  </Text>
                </Pressable>

                <Pressable
                  style={chips.chip}
                  onPress={() => setFilterOpen(true)}>
                  <Text style={chips.chipText}>
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
                  const isAdded = addedIds.includes(exercise.id);
                  return (
                    <View
                      key={exercise.id}
                      style={[
                        cards.row,
                        exercise.is_favorite &&
                          styles.rowFavorite
                      ]}>
                      <View style={styles.rowMain}>
                        <Pressable
                          style={styles.rowText}
                          onPress={() => toggleExpanded(exercise.id)}>
                          <Text style={text.exerciseName}>
                            {exercise.exercise_name}
                          </Text>
                          {exercise.exercise_category ? (
                            <Text style={text.exerciseCategory}>
                              {exercise.exercise_category}
                            </Text>
                          ) : null}
                        </Pressable>

                        <Pressable
                          hitSlop={8}
                          onPress={() => toggleFavorite(exercise)}>
                          <Text style={styles.heartText}>
                            {exercise.is_favorite ? "❤️" : "🤍"}
                          </Text>
                        </Pressable>
                      </View>

                      {isExpanded ? (
                        <Pressable
                          style={[
                            styles.addToWorkoutButton,
                            isAdded && styles.addToWorkoutButtonAdded
                          ]}
                          onPress={() => toggleAdded(exercise.id)}>
                          <Text
                            style={[
                              styles.addToWorkoutText,
                              isAdded && styles.addToWorkoutTextAdded
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

            <View style={sheet.footer}>
              {!loadingExercises ? (
                <Pressable
                  style={sheet.link}
                  onPress={() => {
                    setLibraryOpen(false);
                    router.push("/workout/add-exercise");
                  }}>
                  <Text style={sheet.linkText}>
                    + Add an Exercise
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                style={sheet.done}
                onPress={() => setLibraryOpen(false)}>
                <Text style={sheet.doneText}>
                  Done
                </Text>
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
          style={modal.backdrop}
          onPress={() => setFilterOpen(false)}>
          <View style={modal.card}>
            <Text style={modal.title}>
              Filter by category
            </Text>

            {["Upper body", "Lower body", "Cardio"].map(
              (option) => (
                <Pressable
                  key={option}
                  style={modal.option}
                  onPress={() => {
                    setSelectedFilterCategory(option);
                    setFilter("all");
                    setFilterOpen(false);
                  }}>
                  <Text
                    style={
                      selectedFilterCategory === option
                        ? modal.optionTextActive
                        : modal.optionText
                    }>
                    {option}
                  </Text>
                </Pressable>
              )
            )}

            {selectedFilterCategory ? (
              <Pressable
                style={modal.option}
                onPress={() => {
                  setSelectedFilterCategory("");
                  setFilterOpen(false);
                }}>
                <Text style={modal.optionText}>
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
  subtitle: {
    marginBottom: space.xxl
  },
  notesInput: {
    height: 64
  },
  browseBlock: {
    marginTop: space.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  browseCardText: {
    flex: 1
  },
  browseCardChevron: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: space.md
  },
  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: space.md
  },
  addedRowFirst: {
    paddingTop: 0
  },
  addedRemove: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 6
  },
  libraryControls: {
    paddingHorizontal: space.xl,
    paddingBottom: 14,
    gap: 10
  },
  searchInput: {
    paddingVertical: 10
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  libraryList: {
    flex: 1
  },
  libraryListContent: {
    paddingHorizontal: space.xl,
    paddingTop: 4,
    paddingBottom: space.lg
  },
  libraryEmpty: {
    alignItems: "center",
    paddingVertical: space.huge
  },
  rowFavorite: {
    backgroundColor: colors.surfaceSage
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowText: {
    flex: 1
  },
  addToWorkoutButton: {
    marginTop: space.md,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.forest,
    alignItems: "center"
  },
  addToWorkoutButtonAdded: {
    backgroundColor: colors.surface
  },
  addToWorkoutText: {
    ...typography.caption,
    fontWeight: "800",
    color: colors.onDark
  },
  addToWorkoutTextAdded: {
    color: colors.ink
  },
  heartText: {
    fontSize: 18,
    marginLeft: space.md
  },
  createButton: {
    paddingVertical: 18,
    marginTop: space.xxxl,
    marginBottom: space.sm,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  createButtonText: {
    ...typography.bodyStrong,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: colors.onDark
  }
});
