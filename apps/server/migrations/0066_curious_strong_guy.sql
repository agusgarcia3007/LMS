CREATE TYPE "public"."enrollment_source" AS ENUM('purchase', 'admin', 'claim', 'free');--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "source" "enrollment_source" DEFAULT 'purchase' NOT NULL;--> statement-breakpoint
CREATE INDEX "enrollments_source_idx" ON "enrollments" USING btree ("source");