import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
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
  colors,
  form,
  layout,
  space,
  text
} from "../../theme";

export default function AddExerciseScreen() {
  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/workout/workouthome");
    }
  };

  const handleSaveExercise = async () => {
    const { error } = await supabase.from("exercises").insert({
      exercise_name: exerciseName,
      exercise_category: category,
      is_library: false,
      default_sets: sets ? Number(sets) : null,
      default_reps: reps ? Number(reps) : null,
      exercise_weight: weight ? Number(weight) : null,
      exercise_notes: notes
    });

    if (error) {
      console.log("Could not save exercise:", error.message);
      return;
    }

    goBack();
  };

  return (
    <KeyboardAvoidingView
      style={layout.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={layout.scrollContent}>
        <Pressable style={buttons.backLink} onPress={goBack}>
          <Text style={buttons.backText}>‹ Back</Text>
        </Pressable>

        <Text style={text.screenTitle}>Add Exercise</Text>

        <View style={cards.card}>
          <Text style={text.fieldLabel}>Exercise name</Text>
          <TextInput
            style={form.input}
            placeholder="Example: Preacher Curls"
            placeholderTextColor={colors.inkPlaceholder}
            value={exerciseName}
            onChangeText={setExerciseName}
          />

          <Text style={text.fieldLabel}>Category</Text>
          <TextInput
            style={form.input}
            placeholder="Example: Cardio, Lower Body, Chest"
            placeholderTextColor={colors.inkPlaceholder}
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.smallInputsRow}>
            <View style={styles.smallInputGroup}>
              <Text style={text.fieldLabel}>Sets</Text>
              <TextInput
                style={form.input}
                placeholder="3"
                placeholderTextColor={colors.inkPlaceholder}
                keyboardType="numeric"
                value={sets}
                onChangeText={setSets}
              />
            </View>

            <View style={styles.smallInputGroup}>
              <Text style={text.fieldLabel}>Reps</Text>
              <TextInput
                style={form.input}
                placeholder="8"
                placeholderTextColor={colors.inkPlaceholder}
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
              />
            </View>
          </View>

          <Text style={text.fieldLabel}>Weight (optional)</Text>
          <TextInput
            style={form.input}
            placeholder="Example: 25 lbs"
            placeholderTextColor={colors.inkPlaceholder}
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={text.fieldLabel}>Notes (optional)</Text>
          <TextInput
            style={[form.input, styles.notesInput]}
            placeholder="Add any instructions or reminders..."
            placeholderTextColor={colors.inkPlaceholder}
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <Pressable
          style={[buttons.primary, styles.saveButton]}
          onPress={handleSaveExercise}>
          <Text style={buttons.primaryText}>
            Save Exercise
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  smallInputsRow: {
    flexDirection: "row",
    gap: space.md
  },
  smallInputGroup: {
    flex: 1
  },
  notesInput: {
    height: 100
  },
  saveButton: {
    paddingVertical: 16,
    marginTop: space.xxl
  }
});
