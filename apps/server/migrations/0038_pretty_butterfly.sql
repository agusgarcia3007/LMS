CREATE TYPE "public"."tenant_status" AS ENUM('active', 'suspended', 'cancelled');--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "max_users" integer;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "max_courses" integer;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "max_storage_bytes" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "features" jsonb;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "status" "tenant_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX "tenants_status_idx" ON "tenants" USING btree ("status");