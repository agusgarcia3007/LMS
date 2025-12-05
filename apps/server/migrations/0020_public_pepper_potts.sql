CREATE TYPE "public"."tenant_mode" AS ENUM('light', 'dark', 'auto');--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "mode" "tenant_mode" DEFAULT 'auto';