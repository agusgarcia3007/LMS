import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";

const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "uselearnbase.com";
const API_URL = import.meta.env.VITE_API_URL;
const RESERVED_SUBDOMAINS = ["www", "api", "admin", "app"];

export type ServerTenantInfo = {
  slug: string | null;
  isCampus: boolean;
  isCustomDomain: boolean;
};

function isOurDomain(hostname: string): boolean {
  return hostname === BASE_DOMAIN || hostname.endsWith(`.${BASE_DOMAIN}`);
}

export const getTenantFromRequest = createServerFn({ method: "GET" }).handler(
  async (): Promise<ServerTenantInfo> => {
    const host = getRequestHost({ xForwardedHost: true });
    const hostname = host.split(":")[0];

    if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
      return { slug: null, isCampus: false, isCustomDomain: false };
    }

    if (isOurDomain(hostname)) {
      const parts = hostname.split(".");
      if (parts.length >= 3 && !RESERVED_SUBDOMAINS.includes(parts[0])) {
        return { slug: parts[0], isCampus: true, isCustomDomain: false };
      }
      return { slug: null, isCampus: false, isCustomDomain: false };
    }

    const response = await fetch(
      `${API_URL}/campus/resolve?hostname=${encodeURIComponent(hostname)}`
    );
    if (!response.ok) {
      return { slug: null, isCampus: true, isCustomDomain: true };
    }
    const data = await response.json();
    return { slug: data.tenant.slug, isCampus: true, isCustomDomain: true };
  }
);
