import { describe, it, expect, beforeEach, afterEach } from "bun:test";

const originalBaseDomain = process.env.BASE_DOMAIN;

beforeEach(() => {
  process.env.BASE_DOMAIN = "example.com";
});

afterEach(() => {
  if (originalBaseDomain) {
    process.env.BASE_DOMAIN = originalBaseDomain;
  }
});

function isLocalhost(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function isOurSubdomain(host: string): boolean {
  const hostWithoutPort = host.split(":")[0];
  return hostWithoutPort.endsWith(`.${process.env.BASE_DOMAIN}`);
}

function extractSlugFromHost(host: string): string | null {
  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");
  if (parts.length < 3) return null;
  return parts[0];
}

describe("isLocalhost", () => {
  it("returns true for localhost", () => {
    expect(isLocalhost("localhost")).toBe(true);
    expect(isLocalhost("localhost:3000")).toBe(true);
  });

  it("returns true for 127.0.0.1", () => {
    expect(isLocalhost("127.0.0.1")).toBe(true);
    expect(isLocalhost("127.0.0.1:3000")).toBe(true);
  });

  it("returns false for other hosts", () => {
    expect(isLocalhost("example.com")).toBe(false);
    expect(isLocalhost("acme.example.com")).toBe(false);
  });
});

describe("isOurSubdomain", () => {
  it("returns true for valid subdomain", () => {
    expect(isOurSubdomain("acme.example.com")).toBe(true);
    expect(isOurSubdomain("tenant.example.com")).toBe(true);
  });

  it("returns true for subdomain with port", () => {
    expect(isOurSubdomain("acme.example.com:3000")).toBe(true);
  });

  it("returns false for custom domain", () => {
    expect(isOurSubdomain("courses.acme.com")).toBe(false);
  });

  it("returns false for base domain without subdomain", () => {
    expect(isOurSubdomain("example.com")).toBe(false);
  });
});

describe("extractSlugFromHost", () => {
  it("extracts slug from subdomain", () => {
    expect(extractSlugFromHost("acme.example.com")).toBe("acme");
    expect(extractSlugFromHost("tenant123.example.com")).toBe("tenant123");
  });

  it("extracts slug ignoring port", () => {
    expect(extractSlugFromHost("acme.example.com:3000")).toBe("acme");
  });

  it("returns null for host with less than 3 parts", () => {
    expect(extractSlugFromHost("example.com")).toBeNull();
    expect(extractSlugFromHost("localhost")).toBeNull();
  });

  it("extracts first segment for nested subdomains", () => {
    expect(extractSlugFromHost("api.acme.example.com")).toBe("api");
  });
});
