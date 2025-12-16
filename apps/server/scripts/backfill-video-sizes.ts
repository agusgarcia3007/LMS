import { db } from "../src/db";
import { videosTable } from "../src/db/schema";
import { s3 } from "../src/lib/s3";
import { and, isNull, isNotNull, eq } from "drizzle-orm";

async function backfillVideoSizes() {
  console.log("Starting video file sizes backfill...");

  const videos = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      videoKey: videosTable.videoKey,
    })
    .from(videosTable)
    .where(
      and(isNotNull(videosTable.videoKey), isNull(videosTable.fileSizeBytes))
    );

  console.log(`Found ${videos.length} videos without file sizes`);

  let processed = 0;
  let errors = 0;

  for (const video of videos) {
    try {
      const file = s3.file(video.videoKey!);
      const exists = await file.exists();

      if (!exists) {
        console.warn(`[SKIP] ${video.title}: File not found in S3`);
        errors++;
        continue;
      }

      const stat = await file.stat();
      const size = stat?.size;

      if (size && size > 0) {
        await db
          .update(videosTable)
          .set({ fileSizeBytes: size })
          .where(eq(videosTable.id, video.id));
        processed++;
        console.log(
          `[${processed}/${videos.length}] ${video.title}: ${(size / 1024 / 1024).toFixed(2)} MB`
        );
      } else {
        console.warn(`[SKIP] ${video.title}: Could not get size`);
        errors++;
      }
    } catch (err) {
      console.error(`[ERROR] ${video.title}:`, err);
      errors++;
    }
  }

  console.log(`\nBackfill complete!`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Errors: ${errors}`);
  process.exit(0);
}

backfillVideoSizes().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
