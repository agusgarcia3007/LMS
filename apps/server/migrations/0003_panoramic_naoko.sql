CREATE INDEX "users_tenant_id_idx" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");