DO $$ BEGIN
  CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."job_type" AS ENUM('send-welcome-email', 'create-stripe-customer', 'send-tenant-welcome-email');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_type" "job_type" NOT NULL,
	"job_data" jsonb NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_status_idx" ON "jobs_history" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_job_type_idx" ON "jobs_history" USING btree ("job_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_created_at_idx" ON "jobs_history" USING btree ("created_at");
