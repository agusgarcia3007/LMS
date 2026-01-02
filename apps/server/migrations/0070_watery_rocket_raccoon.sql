ALTER TABLE "ai_conversations" ALTER COLUMN "last_message_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_conversations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_conversations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ai_conversations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_conversations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ai_messages" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_messages" ALTER COLUMN "created_at" SET DEFAULT now();