import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { supabase } from "../../../../../utils/supabase";
import {
  Button,
  Icon,
  Screen,
  TextField,
  colors,
  space,
  typography
} from "../../../theme";

export default function AddExerciseScreen() {
  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workout/workouthome");
    }
  };

  const handleSaveExercise = async () => {
    if (!exerciseName.trim()) {
      setError(
        "Give the exercise a name so you can find it later."
      );
      return;
    }

    setError("");
    setSaving(true);

    try {
      const { error: saveError } = await supabase
        .from("exercises")
        .insert({
          exercise_name: exerciseName.trim(),
          exercise_category: category.trim() || null,
          is_library: false,
          default_sets: sets ? Number(sets) : null,
          default_reps: reps ? Number(reps) : null,
          exercise_weight: weight ? Number(weight) : null,
          exercise_notes: notes.trim() || null
        });

      if (saveError) {
        console.log(
          "Could not save exercise:",
          saveError.message
        );
        setError(
          "Could not save the exercise. Please try again."
        );
        return;
      }

      goBack();
    } catch {
      setError(
        "Could not save the exercise. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
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

      <Text style={styles.title}>Add Exercise</Text>
      <Text style={styles.subtitle}>
        Save the exercises you train so you can build workouts
        from them later.
      </Text>

      <View style={styles.form}>
        <TextField
          label="Exercise name"
          value={exerciseName}
          onChangeText={setExerciseName}
          placeholder="Example: Preacher Curls"
          error={error}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <TextField
          label="Category"
          value={category}
          onChangeText={setCategory}
          placeholder="Example: Cardio, Lower Body, Chest"
          hint="Optional, helps you filter your library."
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.pair}>
          <View style={styles.pairItem}>
            <TextField
              label="Sets"
              value={sets}
              onChangeText={setSets}
              placeholder="3"
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>

          <View style={styles.pairItem}>
            <TextField
              label="Reps"
              value={reps}
              onChangeText={setReps}
              placeholder="8"
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
        </View>

        <TextField
          label="Weight (optional)"
          value={weight}
          onChangeText={setWeight}
          placeholder="Example: 25 lbs"
          returnKeyType="next"
        />

        <TextField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any instructions or reminders..."
          multiline
          minHeight={100}
          returnKeyType="done"
          onSubmitEditing={() => {
            void handleSaveExercise();
          }}
        />
      </View>

      <Button
        label="Save Exercise"
        onPress={() => {
          void handleSaveExercise();
        }}
        loading={saving}
        style={styles.submit}
      />
    </Screen>
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
  form: {
    marginBottom: space.md
  },
  pair: {
    flexDirection: "row",
    gap: space.md
  },
  pairItem: {
    flex: 1
  },
  submit: {
    marginTop: space.lg
  }
});
