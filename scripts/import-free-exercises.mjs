import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

async function main() {
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

  const fileUrl = new URL(
    "../data/sources/free-exercise-db-main/dist/exercises.json",
    import.meta.url
  );

  const contents = await readFile(fileUrl, "utf8");
  const exercises = JSON.parse(contents);

  const rows = exercises.map((exercise) => ({
    source: "free-exercise-db",
    source_id: exercise.id,
    exercise_name: exercise.name,
    exercise_category: exercise.category ?? null,
    is_library: true,
    image_paths: (exercise.images ?? []).map(
      (path) => `free-exercise-db/${path}`
    )
  }));

  const batchSize = 100;

  for (
    let offset = 0;
    offset < rows.length;
    offset += batchSize
  ) {
    const batch = rows.slice(offset, offset + batchSize);

    const { error } = await supabase
      .from("exercises")
      .upsert(batch, {
        onConflict: "source,source_id"
      });

    if (error) {
      throw error;
    }

    console.log(
      `Imported ${offset + batch.length} of ${rows.length} exercises.`
    );
  }
}
main().catch((error) => {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
});
