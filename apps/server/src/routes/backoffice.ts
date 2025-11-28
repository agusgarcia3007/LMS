import { Elysia } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { withHandler } from "@/lib/handler";
import { db } from "@/db";
import { tenantsTable, usersTable } from "@/db/schema";
import { count } from "drizzle-orm";

export const backofficeRoutes = new Elysia().use(authPlugin).get(
  "/stats",
  (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }

      if (ctx.userRole !== "superadmin") {
        throw new AppError(
          ErrorCode.SUPERADMIN_REQUIRED,
          "Only superadmins can access backoffice stats",
          403
        );
      }

      const [usersResult, tenantsResult] = await Promise.all([
        db.select({ count: count() }).from(usersTable),
        db.select({ count: count() }).from(tenantsTable),
      ]);

      return {
        stats: {
          totalUsers: usersResult[0].count,
          totalTenants: tenantsResult[0].count,
        },
      };
    }),
  {
    detail: {
      tags: ["Backoffice"],
      summary: "Get backoffice dashboard stats (superadmin only)",
    },
  }
);
