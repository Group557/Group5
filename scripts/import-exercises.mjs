import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const fileUrl = new URL(
  "../data/exercises.json",
  import.meta.url
);

async function main() {
  const fileContents = await readFile(fileUrl, "utf8");
  const exercises = JSON.parse(fileContents);

  if (!Array.isArray(exercises)) {
    throw new Error("The exercise file must contain an array.");
  }
  const seenIdentifiers = new Set();

  for (const exercise of exercises) {
    if (
      typeof exercise.exercise_name !== "string" ||
      !exercise.exercise_name.trim()
    ) {
      throw new Error("Every exercise must have a name.");
    }
    if (
      typeof exercise.source !== "string" ||
      !exercise.source.trim() ||
      typeof exercise.source_id !== "string" ||
      !exercise.source_id.trim()
    ) {
      throw new Error(
        "Every exercise must have a source and source_id."
      );
    }

    const identifier = JSON.stringify([
      exercise.source,
      exercise.source_id
    ]);

    if (seenIdentifiers.has(identifier)) {
      throw new Error(
        `Duplicate exercise identifier: ${identifier}`
      );
    }

    seenIdentifiers.add(identifier);
  }

  console.log(`Loaded ${exercises.length} exercises:`);
  console.table(exercises);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Missing Supabase URL or secret key.");
  }

  const supabase = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: existingExercises, error } = await supabase
    .from("exercises")
    .select("id, exercise_name, source, source_id")
    .in(
      "exercise_name",
      exercises.map((exercise) => exercise.exercise_name)
    );

  if (error) {
    throw error;
  }

  console.log("Connected to Supabase.");
  console.log("Existing exercises with matching names:");
  console.table(existingExercises);

  const rows = exercises.map((exercise) => ({
    source: exercise.source,
    source_id: exercise.source_id,
    exercise_name: exercise.exercise_name,
    exercise_category: exercise.exercise_category ?? null,
    is_library: true
  }));

  const { data: savedExercises, error: importError } =
    await supabase
      .from("exercises")
      .upsert(rows, {
        onConflict: "source,source_id"
      })
      .select("id, exercise_name, source, source_id");

  if (importError) {
    throw importError;
  }

  console.log(`Imported ${savedExercises.length} exercises.`);
  console.table(savedExercises);
}

main().catch((error) => {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
});
