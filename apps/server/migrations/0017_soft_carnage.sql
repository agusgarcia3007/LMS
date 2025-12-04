ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_tenant_idx" ON "users" USING btree ("email","tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_null_tenant_idx" ON "users" USING btree ("email") WHERE tenant_id IS NULL;