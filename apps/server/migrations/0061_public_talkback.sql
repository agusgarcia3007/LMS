ALTER TYPE "public"."job_type" ADD VALUE 'send-revenuecat-welcome-email';--> statement-breakpoint
CREATE TABLE "revenuecat_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"tenant_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"app_user_id" text NOT NULL,
	"email" text,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "revenuecat_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "revenuecat_webhook_secret" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "revenuecat_default_course_id" uuid;--> statement-breakpoint
ALTER TABLE "revenuecat_events" ADD CONSTRAINT "revenuecat_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "revenuecat_events_event_id_idx" ON "revenuecat_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "revenuecat_events_tenant_id_idx" ON "revenuecat_events" USING btree ("tenant_id");