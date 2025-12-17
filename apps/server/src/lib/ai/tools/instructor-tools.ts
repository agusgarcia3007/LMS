import { tool } from "ai";
import { db } from "@/db";
import { instructorProfilesTable, usersTable, coursesTable } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { listInstructorsSchema } from "./schemas";
import { type ToolContext } from "./utils";

export function createInstructorTools(ctx: ToolContext) {
  const { tenantId } = ctx;

  return {
    listInstructors: tool({
      description:
        "List available instructors to assign to courses. Returns instructors linked to user accounts.",
      inputSchema: listInstructorsSchema,
      execute: async ({ limit }) => {
        const instructors = await db
          .select({
            id: instructorProfilesTable.id,
            userId: usersTable.id,
            name: usersTable.name,
            title: instructorProfilesTable.title,
          })
          .from(instructorProfilesTable)
          .innerJoin(
            usersTable,
            eq(instructorProfilesTable.userId, usersTable.id)
          )
          .where(eq(instructorProfilesTable.tenantId, tenantId))
          .limit(limit ?? 20);

        logger.info("listInstructors executed", { count: instructors.length });
        return { instructors, count: instructors.length };
      },
    }),
  };
}
