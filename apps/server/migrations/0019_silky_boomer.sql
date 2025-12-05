CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'multiple_select', 'true_false');--> statement-breakpoint
CREATE TABLE "quiz_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"type" "question_type" NOT NULL,
	"question_text" text NOT NULL,
	"explanation" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "type" SET DEFAULT 'video'::text;--> statement-breakpoint
DROP TYPE "public"."lesson_type";--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('video', 'file', 'quiz');--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "type" SET DEFAULT 'video'::"public"."lesson_type";--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "type" SET DATA TYPE "public"."lesson_type" USING "type"::"public"."lesson_type";--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "file_key" text;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "file_name" text;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "mime_type" text;--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quiz_options_question_id_idx" ON "quiz_options" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_options_order_idx" ON "quiz_options" USING btree ("question_id","order");--> statement-breakpoint
CREATE INDEX "quiz_questions_lesson_id_idx" ON "quiz_questions" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "quiz_questions_tenant_id_idx" ON "quiz_questions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "quiz_questions_order_idx" ON "quiz_questions" USING btree ("lesson_id","order");