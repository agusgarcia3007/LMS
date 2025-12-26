import { db } from "../src/db";
import { coursesTable } from "../src/db/schema";
import { isNull, eq } from "drizzle-orm";
import { generateEmbedding } from "../src/lib/ai/embeddings";

const BATCH_SIZE = 50;

async function backfillCourseEmbeddings() {
  console.log("Starting course embeddings backfill...");

  const courses = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      shortDescription: coursesTable.shortDescription,
      description: coursesTable.description,
    })
    .from(coursesTable)
    .where(isNull(coursesTable.embedding));

  console.log(`Found ${courses.length} courses without embeddings`);

  if (courses.length === 0) {
    console.log("Nothing to process.");
    process.exit(0);
  }

  let processed = 0;
  for (let i = 0; i < courses.length; i += BATCH_SIZE) {
    const batch = courses.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (course) => {
        const text =
          `${course.title} ${course.shortDescription || ""} ${course.description || ""}`.trim();
        const embedding = await generateEmbedding(text);
        await db
          .update(coursesTable)
          .set({ embedding })
          .where(eq(coursesTable.id, course.id));
        processed++;
        console.log(`[${processed}/${courses.length}] ${course.title}`);
      })
    );
  }

  console.log(`\nBackfill complete! Processed ${processed} courses.`);
  process.exit(0);
}

backfillCourseEmbeddings().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
