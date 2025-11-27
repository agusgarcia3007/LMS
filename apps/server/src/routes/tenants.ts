import { Elysia, t } from "elysia";
import { authPlugin, type UserWithoutPassword } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { db } from "@/db";
import { tenantsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

function checkCanCreateTenant(user: UserWithoutPassword | null, userRole: string | null) {
  if (!user) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
  }
  if (userRole === "superadmin") {
    return;
  }
  if (userRole === "owner") {
    if (user.tenantId !== null) {
      throw new AppError(
        ErrorCode.OWNER_ALREADY_HAS_TENANT,
        "You already have a tenant",
        400
      );
    }
    return;
  }
  throw new AppError(
    ErrorCode.FORBIDDEN,
    "Only superadmins and owners can create tenants",
    403
  );
}

export const tenantsRoutes = new Elysia().use(authPlugin);

tenantsRoutes.post(
  "/",
  async ({ body, user, userRole, set }) => {
    try {
      checkCanCreateTenant(user, userRole);

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

      // If owner, link them to this tenant
      if (userRole === "owner" && user) {
        await db
          .update(usersTable)
          .set({ tenantId: tenant.id })
          .where(eq(usersTable.id, user.id));
      }

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
      summary: "Create a new tenant (superadmin or owner)",
    },
  }
);

tenantsRoutes.get(
  "/",
  async ({ user, userRole, set }) => {
    try {
      if (!user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }

      // Superadmin sees all tenants
      if (userRole === "superadmin") {
        const tenants = await db.select().from(tenantsTable);
        return { tenants };
      }

      // Owner sees only their tenant
      if (userRole === "owner") {
        if (!user.tenantId) {
          return { tenants: [] };
        }
        const tenants = await db
          .select()
          .from(tenantsTable)
          .where(eq(tenantsTable.id, user.tenantId));
        return { tenants };
      }

      throw new AppError(ErrorCode.FORBIDDEN, "Access denied", 403);
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
      summary: "List tenants (superadmin: all, owner: their tenant)",
    },
  }
);

tenantsRoutes.get(
  "/:slug",
  async ({ params, user, userRole, set }) => {
    try {
      if (!user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }

      const [tenant] = await db
        .select()
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, params.slug))
        .limit(1);

      if (!tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }

      // Superadmin can see any tenant
      if (userRole === "superadmin") {
        return { tenant };
      }

      // Owner can only see their own tenant
      if (userRole === "owner" && user.tenantId === tenant.id) {
        return { tenant };
      }

      throw new AppError(ErrorCode.FORBIDDEN, "Access denied", 403);
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
      summary: "Get tenant by slug (superadmin or owner)",
    },
  }
);
