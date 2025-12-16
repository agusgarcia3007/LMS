ALTER TABLE "tenants" ADD COLUMN "published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
CREATE INDEX "tenants_published_idx" ON "tenants" USING btree ("published");