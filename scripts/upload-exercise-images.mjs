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
  const imagePaths = [
    ...new Set(
      exercises.flatMap((exercise) => exercise.images ?? [])
    )
  ];

  console.log(`Uploading ${imagePaths.length} images...`);

  for (const imagePath of imagePaths) {
    const localFile = new URL(
      `../data/sources/free-exercise-db-main/exercises/${imagePath}`,
      import.meta.url
    );

    const fileContents = await readFile(localFile);
    const storagePath = `free-exercise-db/${imagePath}`;

    const { error } = await supabase.storage
      .from("exercise-images")
      .upload(storagePath, fileContents, {
        contentType: "image/jpeg",
        upsert: true
      });

    if (error) {
      throw error;
    }

    console.log(`Uploaded: ${storagePath}`);
  }
}

main().catch((error) => {
  console.error("Upload failed:", error.message);
  process.exitCode = 1;
});
