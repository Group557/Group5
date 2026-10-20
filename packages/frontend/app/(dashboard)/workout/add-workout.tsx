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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../../../utils/supabase";
import {
  Button,
  EmptyState,
  Icon,
  Screen,
  TextField,
  colors,
  radius,
  space,
  typography
} from "../../../theme";

const CATEGORIES = [
  "Cardio / Aerobic",
  "Strength / Resistance",
  "HIIT",
  "Flexibility / Mobility",
  "Balance / Stability",
  "Circuit",
  "Other"
];

const FILTER_CATEGORIES = [
  "Upper body",
  "Lower body",
  "Cardio"
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
  const insets = useSafeAreaInsets();

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

    try {
      // 1. Save the workout itself.
      const { data: workout, error: workoutError } =
        await supabase
          .from("workouts")
          .insert({
            workout_name: workoutName.trim(),
            workout_category: category || null,
            workout_notes: description.trim() || null
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
          return;
        }
      }

      goBack();
    } catch {
      setSaveError("Could not save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Screen keyboard>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={styles.back}>
          <Icon
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left"
            }}
            size={20}
            color={colors.forest}
            weight="regular"
          />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>New Workout</Text>
        <Text style={styles.subtitle}>
          Name your workout, then select saved exercises from
          your library to include.
        </Text>

        <View style={styles.card}>
          <TextField
            label="Workout name"
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Example: Leg Day"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.select}
            onPress={() => {
              setCategoryOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Category, ${
              category || "not selected"
            }`}
            accessibilityHint="Opens the category list">
            <Text
              style={
                category
                  ? styles.selectValue
                  : styles.selectPlaceholder
              }>
              {category || "Select a category"}
            </Text>
            <Icon
              name={{
                ios: "chevron.up.chevron.down",
                android: "unfold_more",
                web: "unfold_more"
              }}
              size={16}
              color={colors.inkMuted}
              weight="regular"
            />
          </Pressable>

          <TextField
            label="Notes (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Example: Glute focused lower body"
            multiline
            minHeight={84}
            returnKeyType="done"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          {addedExercises.length === 0 ? (
            <View style={styles.panel}>
              <EmptyState
                icon={{
                  ios: "list.bullet.clipboard",
                  android: "assignment",
                  web: "assignment"
                }}
                title="No exercises added yet"
                body="Tap Browse your exercises below to add some."
              />
            </View>
          ) : (
            <View style={styles.card}>
              {addedExercises.map((exercise, index) => (
                <View
                  key={exercise.id}
                  style={[
                    styles.addedRow,
                    index === 0 ? styles.addedRowFirst : null
                  ]}>
                  <View style={styles.addedText}>
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

                  <Pressable
                    hitSlop={12}
                    onPress={() => {
                      toggleAdded(exercise.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${exercise.exercise_name} from this workout`}>
                    <Icon
                      name={{
                        ios: "xmark",
                        android: "close",
                        web: "close"
                      }}
                      size={18}
                      color={colors.inkMuted}
                      weight="regular"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Button
          label="Browse your exercises"
          variant="secondary"
          icon={{
            ios: "books.vertical",
            android: "library_books",
            web: "library_books"
          }}
          onPress={openLibrary}
          style={styles.browse}
        />

        {saveError ? (
          <View
            style={styles.error}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert">
            <Text style={styles.errorText}>{saveError}</Text>
          </View>
        ) : null}

        <Button
          label="Create Workout"
          onPress={() => {
            void handleCreateWorkout();
          }}
          loading={saving}
          style={styles.submit}
        />
      </Screen>

      {/* Category picker */}
      <Modal
        visible={categoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setCategoryOpen(false);
        }}>
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setCategoryOpen(false);
          }}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              Select a category
            </Text>

            {CATEGORIES.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                accessibilityRole="button"
                accessibilityState={{
                  selected: category === option
                }}
                onPress={() => {
                  setCategory(option);
                  setCategoryOpen(false);
                }}>
                <Text
                  style={
                    category === option
                      ? styles.optionTextActive
                      : styles.optionText
                  }>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Filter picker */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setFilterOpen(false);
        }}>
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setFilterOpen(false);
          }}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              Filter by category
            </Text>

            {FILTER_CATEGORIES.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                accessibilityRole="button"
                accessibilityState={{
                  selected: selectedFilterCategory === option
                }}
                onPress={() => {
                  setSelectedFilterCategory(option);
                  setFilter("all");
                  setFilterOpen(false);
                }}>
                <Text
                  style={
                    selectedFilterCategory === option
                      ? styles.optionTextActive
                      : styles.optionText
                  }>
                  {option}
                </Text>
              </Pressable>
            ))}

            {selectedFilterCategory ? (
              <Pressable
                style={styles.option}
                accessibilityRole="button"
                onPress={() => {
                  setSelectedFilterCategory("");
                  setFilterOpen(false);
                }}>
                <Text style={styles.optionText}>
                  Clear filter
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>

      {/* Exercise library sheet */}
      <Modal
        visible={libraryOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setLibraryOpen(false);
        }}>
        <Pressable
          style={styles.backdropSheet}
          onPress={() => {
            setLibraryOpen(false);
          }}>
          <KeyboardAvoidingView
            style={styles.sheet}
            behavior={
              Platform.OS === "ios" ? "padding" : undefined
            }>
            <Pressable
              style={styles.sheetCard}
              onPress={() => {}}>
              <View style={styles.sheetHeader}>
                <Text style={styles.dialogTitle}>
                  Exercise Library
                </Text>
                <Pressable
                  hitSlop={12}
                  onPress={() => {
                    setLibraryOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Close exercise library">
                  <Icon
                    name={{
                      ios: "xmark",
                      android: "close",
                      web: "close"
                    }}
                    size={18}
                    color={colors.inkMuted}
                    weight="regular"
                  />
                </Pressable>
              </View>

              <View style={styles.sheetControls}>
                <View style={styles.searchRow}>
                  <Icon
                    name={{
                      ios: "magnifyingglass",
                      android: "search",
                      web: "search"
                    }}
                    size={16}
                    color={colors.inkMuted}
                    weight="regular"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search exercises..."
                    placeholderTextColor={colors.inkPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Search exercises"
                  />
                </View>

                <View style={styles.chipRow}>
                  <Pressable
                    style={[
                      styles.chip,
                      filter === "favorites"
                        ? styles.chipActive
                        : null
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: filter === "favorites"
                    }}
                    onPress={() => {
                      const turningOn = filter !== "favorites";
                      setFilter(
                        turningOn ? "favorites" : "all"
                      );
                      if (turningOn) {
                        // Favorites should always show every favorite,
                        // so clear any category or search that could
                        // hide them.
                        setSelectedFilterCategory("");
                        setSearchQuery("");
                      }
                    }}>
                    <Text
                      style={[
                        styles.chipText,
                        filter === "favorites"
                          ? styles.chipTextActive
                          : null
                      ]}>
                      Favorites
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.chip}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by category, ${
                      selectedFilterCategory || "any"
                    }`}
                    onPress={() => {
                      setFilterOpen(true);
                    }}>
                    <Text style={styles.chipText}>
                      {selectedFilterCategory || "Filter"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <ScrollView
                style={styles.sheetList}
                contentContainerStyle={styles.sheetListContent}
                keyboardShouldPersistTaps="handled">
                {loadingExercises ? (
                  <View style={styles.loading}>
                    <ActivityIndicator color={colors.forest} />
                  </View>
                ) : visibleExercises.length === 0 ? (
                  <EmptyState
                    icon={{
                      ios: "magnifyingglass",
                      android: "search",
                      web: "search"
                    }}
                    title="No exercises found"
                    body="Try a different search, or add a new exercise to your library."
                  />
                ) : (
                  visibleExercises.map((exercise) => {
                    const isExpanded =
                      expandedId === exercise.id;
                    const isAdded = addedIds.includes(
                      exercise.id
                    );
                    return (
                      <View
                        key={exercise.id}
                        style={[
                          styles.exerciseRow,
                          exercise.is_favorite
                            ? styles.exerciseRowFavorite
                            : null
                        ]}>
                        <View style={styles.exerciseRowMain}>
                          <Pressable
                            style={styles.exerciseRowText}
                            accessibilityRole="button"
                            accessibilityLabel={`${exercise.exercise_name}. ${
                              isExpanded ? "Hide" : "Show"
                            } details`}
                            onPress={() => {
                              toggleExpanded(exercise.id);
                            }}>
                            <Text
                              style={styles.name}
                              numberOfLines={1}>
                              {exercise.exercise_name}
                            </Text>
                            {exercise.exercise_category ? (
                              <Text
                                style={styles.category}
                                numberOfLines={1}>
                                {exercise.exercise_category}
                              </Text>
                            ) : null}
                          </Pressable>

                          <Pressable
                            hitSlop={12}
                            onPress={() => {
                              void toggleFavorite(exercise);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={
                              exercise.is_favorite
                                ? `Remove ${exercise.exercise_name} from favorites`
                                : `Add ${exercise.exercise_name} to favorites`
                            }>
                            <Icon
                              name={{
                                ios: exercise.is_favorite
                                  ? "heart.fill"
                                  : "heart",
                                android: exercise.is_favorite
                                  ? "favorite"
                                  : "favorite_border",
                                web: exercise.is_favorite
                                  ? "favorite"
                                  : "favorite_border"
                              }}
                              size={18}
                              color={
                                exercise.is_favorite
                                  ? colors.goldText
                                  : colors.inkMuted
                              }
                              weight="regular"
                            />
                          </Pressable>
                        </View>

                        {isExpanded ? (
                          <Pressable
                            style={[
                              styles.addButton,
                              isAdded
                                ? styles.addButtonAdded
                                : null
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{
                              selected: isAdded
                            }}
                            onPress={() => {
                              toggleAdded(exercise.id);
                            }}>
                            <Text
                              style={[
                                styles.addButtonText,
                                isAdded
                                  ? styles.addButtonTextAdded
                                  : null
                              ]}>
                              {isAdded
                                ? "Added to workout"
                                : "Add to workout"}
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>
                    );
                  })
                )}
              </ScrollView>

              <View
                style={[
                  styles.sheetFooter,
                  { paddingBottom: insets.bottom + space.lg }
                ]}>
                {!loadingExercises ? (
                  <Pressable
                    style={styles.addExerciseLink}
                    accessibilityRole="button"
                    onPress={() => {
                      setLibraryOpen(false);
                      router.push("/workout/add-exercise");
                    }}>
                    <Text style={styles.addExerciseLinkText}>
                      Add an Exercise
                    </Text>
                  </Pressable>
                ) : null}

                <Button
                  label="Done"
                  onPress={() => {
                    setLibraryOpen(false);
                  }}
                />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginBottom: space.md
  },
  backText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.forest,
    marginLeft: space.xs
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.inkMuted,
    marginTop: space.xs,
    marginBottom: space.lg
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.lg
  },
  label: {
    ...typography.fieldLabel,
    color: colors.ink,
    marginTop: space.lg,
    marginBottom: space.sm
  },
  select: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selectValue: {
    ...typography.body,
    color: colors.ink
  },
  selectPlaceholder: {
    ...typography.body,
    color: colors.inkPlaceholder
  },

  section: {
    marginTop: space.xl
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink,
    marginBottom: space.md
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: space.sm
  },

  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    paddingVertical: space.md
  },
  addedRowFirst: {
    paddingTop: 0
  },
  addedText: {
    flex: 1,
    minWidth: 0,
    marginRight: space.md
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
  },

  browse: {
    marginTop: space.xl
  },
  error: {
    marginTop: space.lg,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: space.md
  },
  errorText: {
    ...typography.caption,
    color: colors.danger
  },
  submit: {
    marginTop: space.lg
  },

  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: space.xxl
  },
  backdropSheet: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end"
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.lg
  },
  dialogTitle: {
    ...typography.heading,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: space.sm
  },
  option: {
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider
  },
  optionText: {
    ...typography.body,
    color: colors.ink
  },
  optionTextActive: {
    ...typography.body,
    fontWeight: "800",
    color: colors.ink
  },

  sheet: {
    maxHeight: "90%"
  },
  sheetCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.md,
    flexShrink: 1
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.xl,
    paddingBottom: space.md
  },
  sheetControls: {
    paddingHorizontal: space.xl,
    paddingBottom: space.md
  },
  searchRow: {
    justifyContent: "center"
  },
  searchIcon: {
    position: "absolute",
    left: 13,
    zIndex: 1
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceInput,
    color: colors.ink,
    fontSize: 15,
    paddingHorizontal: 13,
    paddingLeft: 38
  },
  chipRow: {
    flexDirection: "row",
    gap: space.sm,
    marginTop: space.sm
  },
  chip: {
    minHeight: 36,
    backgroundColor: colors.surfaceSage,
    borderRadius: radius.sm,
    paddingVertical: space.sm,
    paddingHorizontal: 14,
    justifyContent: "center"
  },
  chipActive: {
    backgroundColor: colors.forest
  },
  chipText: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.ink
  },
  chipTextActive: {
    color: colors.onDark
  },

  sheetList: {
    maxHeight: 420
  },
  sheetListContent: {
    paddingHorizontal: space.xl,
    paddingTop: space.xs,
    paddingBottom: space.md
  },
  loading: {
    alignItems: "center",
    paddingVertical: space.huge
  },
  exerciseRow: {
    backgroundColor: colors.surfaceRow,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    marginBottom: 10
  },
  exerciseRowFavorite: {
    backgroundColor: colors.surfaceSage
  },
  exerciseRowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  exerciseRowText: {
    flex: 1,
    minWidth: 0,
    marginRight: space.md
  },
  addButton: {
    marginTop: space.md,
    minHeight: 40,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonAdded: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  addButtonText: {
    ...typography.caption,
    fontWeight: "800",
    color: colors.onDark
  },
  addButtonTextAdded: {
    color: colors.ink
  },

  sheetFooter: {
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
    gap: space.sm
  },
  addExerciseLink: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    alignItems: "center",
    justifyContent: "center"
  },
  addExerciseLinkText: {
    ...typography.bodySmall,
    fontWeight: "800",
    color: colors.ink
  }
});
