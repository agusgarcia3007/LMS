-- Create new instructor_profiles table
CREATE TABLE IF NOT EXISTS "instructor_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "bio" text,
  "title" text,
  "email" text,
  "website" text,
  "social_links" jsonb,
  "order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instructor_profiles_tenant_id_idx" ON "instructor_profiles" ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instructor_profiles_user_id_idx" ON "instructor_profiles" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "instructor_profiles_tenant_user_idx" ON "instructor_profiles" ("tenant_id", "user_id");
--> statement-breakpoint
-- Drop old FK from courses and create new one
ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_instructor_id_instructors_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_instructor_profiles_id_fk"
  FOREIGN KEY ("instructor_id") REFERENCES "instructor_profiles"("id") ON DELETE SET NULL;
