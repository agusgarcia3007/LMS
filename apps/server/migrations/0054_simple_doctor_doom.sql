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
CREATE TABLE IF NOT EXISTS "tenant_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE IF EXISTS "instructors" RENAME TO "instructor_profiles";--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_instructor_id_instructors_id_fk";
--> statement-breakpoint
ALTER TABLE "instructor_profiles" DROP CONSTRAINT IF EXISTS "instructors_tenant_id_tenants_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "instructors_tenant_id_idx";--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "instructor_profiles" ADD COLUMN "user_id" uuid NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tenant_customers" ADD CONSTRAINT "tenant_customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tenant_customers" ADD CONSTRAINT "tenant_customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_status_idx" ON "jobs_history" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_job_type_idx" ON "jobs_history" USING btree ("job_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_history_created_at_idx" ON "jobs_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_customers_tenant_id_idx" ON "tenant_customers" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_customers_user_id_idx" ON "tenant_customers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_customers_tenant_user_idx" ON "tenant_customers" USING btree ("tenant_id","user_id");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_instructor_profiles_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructor_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "instructor_profiles" ADD CONSTRAINT "instructor_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "instructor_profiles" ADD CONSTRAINT "instructor_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instructor_profiles_tenant_id_idx" ON "instructor_profiles" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instructor_profiles_user_id_idx" ON "instructor_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "instructor_profiles_tenant_user_idx" ON "instructor_profiles" USING btree ("tenant_id","user_id");--> statement-breakpoint
ALTER TABLE "instructor_profiles" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "instructor_profiles" DROP COLUMN IF EXISTS "avatar";
