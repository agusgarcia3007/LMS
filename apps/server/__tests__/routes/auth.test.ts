import { describe, it, expect, mock, beforeEach, beforeAll } from "bun:test";
import { Elysia } from "elysia";
import { createRequest, jsonRequest, parseJsonResponse } from "../helpers/request";
import { errorHandler } from "@/lib/errors";

declare global {
  var mockStore: {
    users: any[];
    tenants: any[];
    refreshTokens: any[];
    currentTenantSlug: string | null;
  };
}

globalThis.mockStore = {
  users: [],
  tenants: [],
  refreshTokens: [],
  currentTenantSlug: null,
};

function getTableName(table: any): string {
  return table?.[Symbol.for("drizzle:Name")] || table?._?.name || "";
}

mock.module("@/db", () => ({
  db: {
    select: () => ({
      from: (table: any) => ({
        where: () => ({
          limit: (n: number) => {
            const name = getTableName(table);
            if (name.includes("tenant")) {
              return Promise.resolve(globalThis.mockStore.tenants.slice(0, n));
            }
            if (name.includes("user")) {
              return Promise.resolve(globalThis.mockStore.users.slice(0, n));
            }
            if (name.includes("refresh")) {
              return Promise.resolve(globalThis.mockStore.refreshTokens.slice(0, n));
            }
            return Promise.resolve([]);
          },
        }),
      }),
    }),
    insert: (table: any) => ({
      values: (values: any) => ({
        returning: () => {
          const item = { id: `mock-${Date.now()}`, ...values };
          const name = getTableName(table);
          if (name.includes("user")) globalThis.mockStore.users.push(item);
          if (name.includes("tenant")) globalThis.mockStore.tenants.push(item);
          if (name.includes("refresh")) globalThis.mockStore.refreshTokens.push(item);
          return Promise.resolve([item]);
        },
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve(),
      }),
    }),
    delete: () => ({
      where: () => Promise.resolve(),
    }),
  },
}));

mock.module("@/jobs", () => ({
  enqueue: () => Promise.resolve(),
}));

mock.module("@/plugins/auth", () => ({
  authPlugin: new Elysia(),
  invalidateUserCache: () => {},
}));

mock.module("@/plugins/tenant", () => ({
  tenantPlugin: new Elysia({ name: "tenant" }).derive(
    { as: "scoped" },
    async ({ headers }): Promise<{ tenant: any }> => {
      const slug = headers["x-tenant-slug"];
      globalThis.mockStore.currentTenantSlug = slug || null;
      if (slug) {
        const tenant = globalThis.mockStore.tenants.find(
          (t) => t.slug === slug && t.status === "active"
        );
        return { tenant: tenant || null };
      }
      return { tenant: null };
    }
  ),
  invalidateTenantCache: () => {},
  invalidateCustomDomainCache: () => {},
}));

function clearMocks() {
  globalThis.mockStore.users = [];
  globalThis.mockStore.tenants = [];
  globalThis.mockStore.refreshTokens = [];
  globalThis.mockStore.currentTenantSlug = null;
}

function tenantRequest(
  path: string,
  body: object,
  tenantSlug: string,
  options?: { method?: string }
) {
  return createRequest(path, {
    method: options?.method || "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Slug": tenantSlug,
    },
    body: JSON.stringify(body),
  });
}

describe("Auth Routes", () => {
  let app: any;

  beforeAll(async () => {
    const { authRoutes } = await import("@/routes/platform/auth");
    app = new Elysia().use(errorHandler).use(authRoutes);
  });

  beforeEach(() => {
    clearMocks();
  });

  describe("GET /check-slug", () => {
    it("returns available=false for reserved slugs", async () => {
      const response = await app.handle(createRequest("/check-slug?slug=admin", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(false);
      expect(data.reason).toBe("reserved");
    });

    it("returns available=false for www slug", async () => {
      const response = await app.handle(createRequest("/check-slug?slug=www", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(false);
      expect(data.reason).toBe("reserved");
    });

    it("returns available=false for invalid format", async () => {
      const response = await app.handle(createRequest("/check-slug?slug=Invalid_Slug!", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(false);
      expect(data.reason).toBe("invalid");
    });

    it("returns available=false for slug too short", async () => {
      const response = await app.handle(createRequest("/check-slug?slug=ab", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(false);
      expect(data.reason).toBe("too_short");
    });

    it("returns available=false for taken slug", async () => {
      globalThis.mockStore.tenants.push({ id: "tenant-1", slug: "acme", status: "active" });
      const response = await app.handle(createRequest("/check-slug?slug=acme", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(false);
      expect(data.reason).toBe("taken");
    });

    it("returns available=true for valid available slug", async () => {
      const response = await app.handle(createRequest("/check-slug?slug=my-academy", { method: "GET" }));
      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.available).toBe(true);
      expect(data.reason).toBeNull();
    });
  });

  describe("POST /signup - Platform", () => {
    it("creates owner on platform signup", async () => {
      const response = await app.handle(
        jsonRequest("/signup", {
          email: "owner@example.com",
          password: "password123",
          name: "Platform Owner",
        })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("owner");
      expect(data.user.tenantId).toBeNull();
      expect(data.accessToken).toBeDefined();
    });

    it("returns 409 if platform email already exists", async () => {
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "existing@example.com",
        tenantId: null,
        role: "owner",
      });

      const response = await app.handle(
        jsonRequest("/signup", {
          email: "existing@example.com",
          password: "password123",
          name: "Test User",
        })
      );

      expect(response.status).toBe(409);
    });

    it("validates password minimum length", async () => {
      const response = await app.handle(
        jsonRequest("/signup", {
          email: "test@example.com",
          password: "short",
          name: "Test User",
        })
      );

      expect(response.status).toBe(400);
    });

    it("validates email format", async () => {
      const response = await app.handle(
        jsonRequest("/signup", {
          email: "invalid-email",
          password: "password123",
          name: "Test User",
        })
      );

      expect(response.status).toBe(400);
    });
  });

  describe("POST /signup - Tenant", () => {
    it("creates student on tenant signup", async () => {
      globalThis.mockStore.tenants.push({
        id: "tenant-1",
        slug: "acme",
        name: "Acme Academy",
        status: "active",
      });

      const response = await app.handle(
        tenantRequest("/signup", {
          email: "student@example.com",
          password: "password123",
          name: "New Student",
        }, "acme")
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("student");
      expect(data.user.tenantId).toBe("tenant-1");
    });

    it("returns 409 if email exists in same tenant", async () => {
      globalThis.mockStore.tenants.push({
        id: "tenant-1",
        slug: "acme",
        name: "Acme",
        status: "active",
      });
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "existing@example.com",
        tenantId: "tenant-1",
        role: "student",
      });

      const response = await app.handle(
        tenantRequest("/signup", {
          email: "existing@example.com",
          password: "password123",
          name: "Duplicate",
        }, "acme")
      );

      expect(response.status).toBe(409);
    });
  });

  describe("POST /login - Platform (No Tenant)", () => {
    it("owner can login to platform", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "owner@example.com",
        password: hashedPassword,
        name: "Owner",
        role: "owner",
        tenantId: "tenant-1",
      });
      globalThis.mockStore.tenants.push({ id: "tenant-1", slug: "acme", status: "active" });

      const response = await app.handle(
        jsonRequest("/login", {
          email: "owner@example.com",
          password: "password123",
        })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("owner");
      expect(data.user.tenantSlug).toBe("acme");
    });

    it("instructor can login to platform", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "instructor@example.com",
        password: hashedPassword,
        name: "Instructor",
        role: "instructor",
        tenantId: "tenant-1",
      });
      globalThis.mockStore.tenants.push({ id: "tenant-1", slug: "acme", status: "active" });

      const response = await app.handle(
        jsonRequest("/login", {
          email: "instructor@example.com",
          password: "password123",
        })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("instructor");
    });

    it("superadmin can login to platform", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "admin@example.com",
        password: hashedPassword,
        name: "Super Admin",
        role: "superadmin",
        tenantId: null,
      });

      const response = await app.handle(
        jsonRequest("/login", {
          email: "admin@example.com",
          password: "password123",
        })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("superadmin");
    });

    it("returns 400 for wrong password", async () => {
      const hashedPassword = await Bun.password.hash("correctpassword");
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "user@example.com",
        password: hashedPassword,
        name: "Test User",
        role: "owner",
        tenantId: null,
      });

      const response = await app.handle(
        jsonRequest("/login", {
          email: "user@example.com",
          password: "wrongpassword",
        })
      );

      expect(response.status).toBe(400);
    });

    it("returns 400 for non-existent user", async () => {
      const response = await app.handle(
        jsonRequest("/login", {
          email: "nonexistent@example.com",
          password: "password123",
        })
      );

      expect(response.status).toBe(400);
    });
  });

  describe("POST /login - Tenant Context", () => {
    it("student can login to their tenant", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.tenants.push({
        id: "tenant-1",
        slug: "acme",
        name: "Acme",
        status: "active",
      });
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "student@example.com",
        password: hashedPassword,
        name: "Student",
        role: "student",
        tenantId: "tenant-1",
      });

      const response = await app.handle(
        tenantRequest("/login", {
          email: "student@example.com",
          password: "password123",
        }, "acme")
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("student");
      expect(data.user.tenantId).toBe("tenant-1");
    });

    it("admin can login to their tenant", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.tenants.push({
        id: "tenant-1",
        slug: "acme",
        name: "Acme",
        status: "active",
      });
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        tenantId: "tenant-1",
      });

      const response = await app.handle(
        tenantRequest("/login", {
          email: "admin@example.com",
          password: "password123",
        }, "acme")
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("admin");
    });

    it("owner can login to their tenant", async () => {
      const hashedPassword = await Bun.password.hash("password123");
      globalThis.mockStore.tenants.push({
        id: "tenant-1",
        slug: "acme",
        name: "Acme",
        status: "active",
      });
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "owner@example.com",
        password: hashedPassword,
        name: "Owner",
        role: "owner",
        tenantId: "tenant-1",
      });

      const response = await app.handle(
        tenantRequest("/login", {
          email: "owner@example.com",
          password: "password123",
        }, "acme")
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.user.role).toBe("owner");
    });
  });

  describe("POST /logout", () => {
    it("returns success message", async () => {
      const response = await app.handle(
        jsonRequest("/logout", { refreshToken: "some-token" })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.message).toBe("Logged out successfully");
    });
  });

  describe("POST /forgot-password", () => {
    it("returns success message even for non-existent email", async () => {
      const response = await app.handle(
        jsonRequest("/forgot-password", { email: "nonexistent@example.com" })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.message).toContain("If the email exists");
    });
  });

  describe("POST /verify-email", () => {
    it("returns 400 for invalid token", async () => {
      const response = await app.handle(
        jsonRequest("/verify-email", { token: "invalid-token" })
      );

      expect(response.status).toBe(400);
    });

    it("verifies email with valid token", async () => {
      globalThis.mockStore.users.push({
        id: "user-1",
        email: "user@example.com",
        emailVerificationToken: "valid-token",
        emailVerified: false,
        emailVerificationTokenExpiresAt: new Date(Date.now() + 86400000),
      });

      const response = await app.handle(
        jsonRequest("/verify-email", { token: "valid-token" })
      );

      expect(response.status).toBe(200);
      const data = await parseJsonResponse(response);
      expect(data.message).toContain("verified");
    });
  });
});
