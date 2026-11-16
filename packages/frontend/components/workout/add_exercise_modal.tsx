import { palette } from "@/constants/theme";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { supabase } from "../../../../utils/supabase";

export type Exercise = {
  id: number;
  exercise_name: string;
  exercise_category: string | null;
  image_paths: string[];
};

type props = {
  selectedExercises: Exercise[];
  onConfirm: (exercises: Exercise[]) => void;
  onClose: () => void;
};

export default function AddExerciseModal({
  onClose,
  selectedExercises,
  onConfirm
}: props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Exercise[]>(
    selectedExercises
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchExercises() {
      try {
        const { data, error: fetchError } = await supabase
          .from("exercises")
          .select(
            "id, exercise_name, exercise_category,image_paths"
          )
          .eq("is_library", true)
          .order("exercise_name");

        if (!active) return;
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setExercises(data ?? []);
        }
      } catch {
        if (active) {
          setError(
            "Could not load exercises. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    void fetchExercises();

    return () => {
      active = false;
    };
  }, []);

  function toggleExercise(exercise: Exercise) {
    setSelected((current) => {
      const alreadySelected = current.some(
        (item) => item.id === exercise.id
      );

      if (alreadySelected) {
        return current.filter(
          (item) => item.id !== exercise.id
        );
      }

      return [...current, exercise];
    });
  }
  const filteredExercises = exercises.filter((exercise) =>
    exercise.exercise_name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );
  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Exercises</Text>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close exercise picker"
              hitSlop={8}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={palette.inkMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search exercises"
          />

          {loading ? (
            <ActivityIndicator size="large" color={palette.ink} />
          ) : error ? (
            <Text>{error}</Text>
          ) : (
            <FlatList
              style={{ flex: 1 }}
              data={filteredExercises}
              extraData={selected}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={
                <Text>
                  {exercises.length === 0
                    ? "No exercises available yet."
                    : "No exercises match your search."}
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = selected.some(
                  (exercise) => exercise.id === item.id
                );
                const imagePath = item.image_paths[0];

                const imageUrl = imagePath
                  ? supabase.storage
                      .from("exercise-images")
                      .getPublicUrl(imagePath).data.publicUrl
                  : null;

                return (
                  <Pressable
                    style={[
                      styles.exerciseRow,
                      isSelected && styles.selectedRow
                    ]}
                    onPress={() => toggleExercise(item)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={item.exercise_name}
                    accessibilityState={{
                      checked: isSelected
                    }}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.thumbnail}
                        resizeMode="contain"
                        accessible={false}
                      />
                    ) : (
                      <View style={styles.thumbnail} />
                    )}

                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseName}>
                        {isSelected ? "✓ " : ""}
                        {item.exercise_name}
                      </Text>

                      {item.exercise_category ? (
                        <Text style={styles.exerciseCategory}>
                          {item.exercise_category}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
          <Pressable
            style={[
              styles.confirmButton,
              (loading || Boolean(error)) &&
                styles.disabledButton
            ]}
            disabled={loading || Boolean(error)}
            onPress={() => onConfirm(selected)}
            accessibilityRole="button">
            <Text style={styles.confirmButtonText}>
              Add Selected ({selected.length})
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20
  },
  card: {
    height: "80%",
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.ink
  },
  closeButton: {
    fontSize: 24,
    color: palette.ink
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.field,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
  },
  exerciseName: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  exerciseCategory: {
    color: palette.inkMuted,
    fontSize: 14,
    marginTop: 4
  },
  selectedRow: {
    backgroundColor: palette.line
  },
  confirmButton: {
    backgroundColor: palette.forest,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16
  },
  confirmButtonText: {
    color: palette.onDark,
    fontSize: 16,
    fontWeight: "700"
  },
  disabledButton: {
    opacity: 0.5
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: palette.surface,
    marginRight: 12
  },
  exerciseDetails: {
    flex: 1
  },
  searchInput: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: palette.ink,
    backgroundColor: palette.field
  }
});
