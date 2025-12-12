import { tool } from "ai";
import { db } from "@/db";
import { instructorsTable, coursesTable } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { logger } from "@/lib/logger";
import {
  listInstructorsSchema,
  createInstructorSchema,
  updateInstructorSchema,
  deleteInstructorSchema,
} from "./schemas";
import { type ToolContext } from "./utils";

export function createInstructorTools(ctx: ToolContext) {
  const { tenantId } = ctx;

  return {
    listInstructors: tool({
      description: "List available instructors to assign to courses.",
      inputSchema: listInstructorsSchema,
      execute: async ({ limit }) => {
        const instructors = await db
          .select({
            id: instructorsTable.id,
            name: instructorsTable.name,
            title: instructorsTable.title,
          })
          .from(instructorsTable)
          .where(eq(instructorsTable.tenantId, tenantId))
          .limit(limit ?? 20);

        logger.info("listInstructors executed", { count: instructors.length });
        return { instructors, count: instructors.length };
      },
    }),

    createInstructor: tool({
      description: "Create a new instructor.",
      inputSchema: createInstructorSchema,
      execute: async ({ name, title, bio }) => {
        const [instructor] = await db
          .insert(instructorsTable)
          .values({
            tenantId,
            name,
            title: title ?? null,
            bio: bio ?? null,
          })
          .returning();

        logger.info("createInstructor executed", { instructorId: instructor.id, name });
        return { type: "instructor_created" as const, id: instructor.id, name: instructor.name };
      },
    }),

    updateInstructor: tool({
      description: "Update an existing instructor's information.",
      inputSchema: updateInstructorSchema,
      execute: async ({ instructorId, name, title, bio }) => {
        const [existing] = await db
          .select({ id: instructorsTable.id })
          .from(instructorsTable)
          .where(and(eq(instructorsTable.tenantId, tenantId), eq(instructorsTable.id, instructorId)))
          .limit(1);

        if (!existing) {
          return { type: "error" as const, error: "Instructor not found" };
        }

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (title !== undefined) updateData.title = title;
        if (bio !== undefined) updateData.bio = bio;

        if (Object.keys(updateData).length === 0) {
          return { type: "error" as const, error: "No fields to update" };
        }

        await db.update(instructorsTable).set(updateData).where(eq(instructorsTable.id, instructorId));

        logger.info("updateInstructor executed", { instructorId });
        return { type: "instructor_updated" as const, instructorId, updatedFields: Object.keys(updateData) };
      },
    }),

    deleteInstructor: tool({
      description: "Delete an instructor. Requires confirmation.",
      inputSchema: deleteInstructorSchema,
      execute: async ({ instructorId, confirmed }) => {
        const [existing] = await db
          .select({ id: instructorsTable.id, name: instructorsTable.name })
          .from(instructorsTable)
          .where(and(eq(instructorsTable.tenantId, tenantId), eq(instructorsTable.id, instructorId)))
          .limit(1);

        if (!existing) {
          return { type: "error" as const, error: "Instructor not found" };
        }

        const [courseCount] = await db
          .select({ count: count() })
          .from(coursesTable)
          .where(eq(coursesTable.instructorId, instructorId));

        if (!confirmed) {
          return {
            type: "confirmation_required" as const,
            action: "delete_instructor",
            instructorId,
            instructorName: existing.name,
            message: `Are you sure you want to delete instructor "${existing.name}"?`,
            warning: courseCount.count > 0 ? `${courseCount.count} courses will have their instructor removed.` : undefined,
          };
        }

        await db.delete(instructorsTable).where(eq(instructorsTable.id, instructorId));

        logger.info("deleteInstructor executed", { instructorId, name: existing.name });
        return { type: "instructor_deleted" as const, instructorId, name: existing.name };
      },
    }),
  };
}
