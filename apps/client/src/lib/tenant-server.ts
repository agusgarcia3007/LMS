import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "learnbase.lat";
const RESERVED_SUBDOMAINS = ["www", "api", "admin", "app"];

type TenantInfo = {
  slug: string | null;
  isCampus: boolean;
  isCustomDomain: boolean;
};

function isOurDomain(hostname: string): boolean {
  return hostname === BASE_DOMAIN || hostname.endsWith(`.${BASE_DOMAIN}`);
}

function parseTenantFromHostname(hostname: string): TenantInfo {
  const host = hostname.split(":")[0];

  if (host === "localhost" || host === "127.0.0.1") {
    return { slug: null, isCampus: false, isCustomDomain: false };
  }

  if (isOurDomain(host)) {
    const parts = host.split(".");
    if (parts.length >= 3 && !RESERVED_SUBDOMAINS.includes(parts[0])) {
      return { slug: parts[0], isCampus: true, isCustomDomain: false };
    }
    return { slug: null, isCampus: false, isCustomDomain: false };
  }

  return { slug: null, isCampus: true, isCustomDomain: true };
}

export const getTenantFromServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const url = new URL(request.url);

    if (import.meta.env.DEV) {
      const campusSlug = url.searchParams.get("campus");
      if (campusSlug) {
        return { slug: campusSlug, isCampus: true, isCustomDomain: false };
      }
    }

    const host = request.headers.get("Host") || request.headers.get("X-Forwarded-Host") || "localhost";
    return parseTenantFromHostname(host);
  }
);

export type TenantSeoData = {
  name: string;
  slug: string;
  logo: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
};

export async function fetchTenantSeo(
  slug: string,
  isCustomDomain: boolean,
  hostname?: string
): Promise<TenantSeoData | null> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (isCustomDomain && hostname) {
    const response = await fetch(
      `${apiUrl}/campus/resolve?hostname=${encodeURIComponent(hostname)}`
    );
    if (!response.ok) return null;
    const json = await response.json();
    return json.tenant;
  }

  const response = await fetch(`${apiUrl}/campus/tenant`, {
    headers: { "X-Tenant-Slug": slug },
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.tenant;
}
