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
      router.replace("/workouthome");
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
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Add Exercise</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Exercise name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Preacher Curls"
            placeholderTextColor="#9CA3AF"
            value={exerciseName}
            onChangeText={setExerciseName}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Cardio, Lower Body, Chest"
            placeholderTextColor="#9CA3AF"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.smallInputsRow}>
            <View style={styles.smallInputGroup}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                style={styles.input}
                placeholder="3"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={sets}
                onChangeText={setSets}
              />
            </View>

            <View style={styles.smallInputGroup}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                style={styles.input}
                placeholder="8"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
              />
            </View>
          </View>

          <Text style={styles.label}>Weight (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 25 lbs"
            placeholderTextColor="#9CA3AF"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add any instructions or reminders..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSaveExercise}>
          <Text style={styles.saveButtonText}>
            Save Exercise
          </Text>
        </Pressable>
      </ScrollView>
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
  smallInputsRow: {
    flexDirection: "row",
    gap: 12
  },
  smallInputGroup: {
    flex: 1
  },
  notesInput: {
    height: 100
  },
  saveButton: {
    backgroundColor: "#154734",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  }
});
