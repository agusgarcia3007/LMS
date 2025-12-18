import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "@/db";
import { tenantsTable } from "@/db/schema";
import { env } from "./env";

const customDomainCorsCache = new Map<string, boolean>();

const LOCALHOST_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^http:\/\/\[::1\](:\d+)?$/,
];

const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Tenant-Slug",
  "X-Requested-With",
  "Accept",
  "Origin",
];

const EXPOSED_HEADERS = ["X-Total-Count", "X-Total-Pages"];
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
const MAX_AGE = "86400";

function isLocalhostOrigin(origin: string): boolean {
  return LOCALHOST_PATTERNS.some((pattern) => pattern.test(origin));
}

function isStaticAllowedOrigin(origin: string): boolean {
  if (isLocalhostOrigin(origin)) return true;

  if (env.CLIENT_URL && origin === env.CLIENT_URL) return true;

  if (env.CORS_ORIGIN) {
    if (env.CORS_ORIGIN.includes("*")) {
      const pattern = env.CORS_ORIGIN.replace(/\*/g, "[a-z0-9-]+");
      const regex = new RegExp(`^https?://${pattern}$`);
      if (regex.test(origin)) return true;

      const baseDomain = env.CORS_ORIGIN.replace(/^\*\./, "");
      const baseRegex = new RegExp(
        `^https?://${baseDomain.replace(/\./g, "\\.")}$`
      );
      if (baseRegex.test(origin)) return true;
    } else if (origin === env.CORS_ORIGIN) {
      return true;
    }
  }

  return false;
}

async function checkCustomDomain(hostname: string): Promise<boolean> {
  if (customDomainCorsCache.has(hostname)) {
    return customDomainCorsCache.get(hostname)!;
  }

  try {
    const [tenant] = await db
      .select({ id: tenantsTable.id })
      .from(tenantsTable)
      .where(eq(tenantsTable.customDomain, hostname))
      .limit(1);

    const isValid = !!tenant;
    customDomainCorsCache.set(hostname, isValid);
    setTimeout(() => customDomainCorsCache.delete(hostname), 5 * 60 * 1000);
    return isValid;
  } catch {
    return false;
  }
}

async function isAllowedOrigin(origin: string | undefined): Promise<boolean> {
  if (!origin) return false;

  if (isStaticAllowedOrigin(origin)) return true;

  try {
    const url = new URL(origin);
    return await checkCustomDomain(url.hostname);
  } catch {
    return false;
  }
}

function setCorsHeaders(headers: Headers, origin: string): void {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", METHODS.join(", "));
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
  headers.set("Access-Control-Expose-Headers", EXPOSED_HEADERS.join(", "));
  headers.set("Access-Control-Max-Age", MAX_AGE);
}

export const corsPlugin = new Elysia({ name: "custom-cors" })
  .onRequest(async ({ request, set }) => {
    const origin = request.headers.get("origin");

    if (!origin) return;

    const allowed = await isAllowedOrigin(origin);
    if (!allowed) return;

    if (request.method === "OPTIONS") {
      const headers = new Headers();
      setCorsHeaders(headers, origin);
      return new Response(null, { status: 204, headers });
    }

    set.headers["Access-Control-Allow-Origin"] = origin;
    set.headers["Access-Control-Allow-Credentials"] = "true";
    set.headers["Access-Control-Expose-Headers"] = EXPOSED_HEADERS.join(", ");
  });
