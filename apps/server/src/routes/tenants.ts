import { Elysia, t } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { db } from "@/db";
import { tenantsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

function checkSuperadmin(user: unknown, userRole: string | null) {
  if (!user) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
  }
  if (userRole !== "superadmin") {
    throw new AppError(
      ErrorCode.SUPERADMIN_REQUIRED,
      "Superadmin access required",
      403
    );
  }
}

export const tenantsRoutes = new Elysia().use(authPlugin);

tenantsRoutes.post(
  "/",
  async ({ body, user, userRole, set }) => {
    try {
      checkSuperadmin(user, userRole);

      const [existing] = await db
        .select()
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, body.slug))
        .limit(1);

      if (existing) {
        throw new AppError(
          ErrorCode.TENANT_SLUG_EXISTS,
          "Tenant slug already exists",
          409
        );
      }

      const [tenant] = await db
        .insert(tenantsTable)
        .values({ slug: body.slug, name: body.name })
        .returning();

      return { tenant };
    } catch (error) {
      console.error("Create tenant error:", error);
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
      slug: t.String({ minLength: 1, pattern: "^[a-z0-9-]+$" }),
      name: t.String({ minLength: 1 }),
    }),
    detail: {
      tags: ["Tenants"],
      summary: "Create a new tenant (superadmin only)",
    },
  }
);

tenantsRoutes.get(
  "/",
  async ({ user, userRole, set }) => {
    try {
      checkSuperadmin(user, userRole);
      const tenants = await db.select().from(tenantsTable);
      return { tenants };
    } catch (error) {
      console.error("List tenants error:", error);
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
    detail: {
      tags: ["Tenants"],
      summary: "List all tenants (superadmin only)",
    },
  }
);

tenantsRoutes.get(
  "/:slug",
  async ({ params, user, userRole, set }) => {
    try {
      checkSuperadmin(user, userRole);

      const [tenant] = await db
        .select()
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, params.slug))
        .limit(1);

      if (!tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }

      return { tenant };
    } catch (error) {
      console.error("Get tenant error:", error);
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
    detail: {
      tags: ["Tenants"],
      summary: "Get tenant by slug (superadmin only)",
    },
  }
);
