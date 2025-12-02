ALTER TABLE "tenants" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "primary_color" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "contact_address" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "social_links" jsonb;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "seo_keywords" text;