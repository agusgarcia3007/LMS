ALTER TABLE "courses" ADD COLUMN "embedding" vector(384);--> statement-breakpoint
CREATE INDEX "courses_embedding_idx" ON "courses" USING hnsw ("embedding" vector_cosine_ops);