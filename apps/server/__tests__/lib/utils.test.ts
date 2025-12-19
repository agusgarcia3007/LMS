import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { parseDuration, getTenantClientUrl } from "../../src/lib/utils";

describe("parseDuration", () => {
  it("formats milliseconds correctly", () => {
    expect(parseDuration(500)).toBe("500.00ms");
    expect(parseDuration(1)).toBe("1.00ms");
    expect(parseDuration(999)).toBe("999.00ms");
  });

  it("formats seconds correctly", () => {
    expect(parseDuration(1000)).toBe("1.00s");
    expect(parseDuration(2500)).toBe("2.50s");
    expect(parseDuration(10000)).toBe("10.00s");
  });

  it("formats microseconds correctly", () => {
    expect(parseDuration(0.5)).toBe("500.00µs");
    expect(parseDuration(0.001)).toBe("1.00µs");
  });

  it("returns null for NaN", () => {
    expect(parseDuration(NaN)).toBeNull();
  });

  it("handles zero", () => {
    expect(parseDuration(0)).toBe("0.00µs");
  });

  it("handles very small values", () => {
    const result = parseDuration(0.0001);
    expect(result).toBe("0.10µs");
  });
});

describe("getTenantClientUrl", () => {
  const originalEnv = process.env.BASE_DOMAIN;

  beforeEach(() => {
    process.env.BASE_DOMAIN = "example.com";
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.BASE_DOMAIN = originalEnv;
    }
  });

  it("returns subdomain URL for tenant without custom domain", () => {
    const tenant = {
      id: "123",
      slug: "acme",
      customDomain: null,
    } as any;

    const result = getTenantClientUrl(tenant);
    expect(result).toContain("acme");
    expect(result).toContain("https://");
  });

  it("returns custom domain URL when available", () => {
    const tenant = {
      id: "123",
      slug: "acme",
      customDomain: "courses.acme.com",
    } as any;

    const result = getTenantClientUrl(tenant);
    expect(result).toBe("https://courses.acme.com");
  });

  it("returns CLIENT_URL for null tenant", () => {
    const result = getTenantClientUrl(null);
    expect(result).toContain("http");
  });
});
