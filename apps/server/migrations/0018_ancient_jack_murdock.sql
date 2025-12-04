CREATE TYPE "public"."background_pattern" AS ENUM('none', 'grid', 'dots', 'waves');--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "hero_pattern" "background_pattern" DEFAULT 'grid';--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "courses_page_pattern" "background_pattern" DEFAULT 'grid';