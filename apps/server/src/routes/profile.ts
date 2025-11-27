import { Elysia, t } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const profileRoutes = new Elysia().use(authPlugin);

profileRoutes.get(
  "/",
  async ({ user, set }) => {
    try {
      if (!user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }
      return { user };
    } catch (error) {
      console.error("Get profile error:", error);
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { code: error.code, message: error.message };
      }
      set.status = 500;
      return {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred",
      };
    }
  },
  {
    detail: { tags: ["Profile"], summary: "Get current user profile" },
  }
);

profileRoutes.put(
  "/",
  async ({ body, user, userId, set }) => {
    try {
      if (!user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }

      const [updated] = await db
        .update(usersTable)
        .set({
          ...(body.name && { name: body.name }),
          ...(body.avatar !== undefined && { avatar: body.avatar }),
        })
        .where(eq(usersTable.id, userId!))
        .returning();
      const { password: _, ...userWithoutPassword } = updated;
      return { user: userWithoutPassword };
    } catch (error) {
      console.error("Update profile error:", error);
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { code: error.code, message: error.message };
      }
      set.status = 500;
      return {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred",
      };
    }
  },
  {
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      avatar: t.Optional(t.Union([t.String(), t.Null()])),
    }),
    detail: { tags: ["Profile"], summary: "Update current user profile" },
  }
);
