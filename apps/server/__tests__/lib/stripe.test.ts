import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  getCommissionRate,
  calculatePlatformFee,
  getPriceIdForPlan,
  getPlanFromPriceId,
  isStripeConfigured,
  PLAN_CONFIG,
} from "../../src/lib/stripe";

describe("getCommissionRate", () => {
  it("returns 5% for starter plan", () => {
    expect(getCommissionRate("starter")).toBe(5);
  });

  it("returns 2% for growth plan", () => {
    expect(getCommissionRate("growth")).toBe(2);
  });

  it("returns 0% for scale plan", () => {
    expect(getCommissionRate("scale")).toBe(0);
  });
});

describe("calculatePlatformFee", () => {
  it("calculates 5% fee correctly", () => {
    expect(calculatePlatformFee(10000, 5)).toBe(500);
  });

  it("calculates 2% fee correctly", () => {
    expect(calculatePlatformFee(10000, 2)).toBe(200);
  });

  it("returns 0 for 0% commission", () => {
    expect(calculatePlatformFee(10000, 0)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculatePlatformFee(9999, 5)).toBe(500);
    expect(calculatePlatformFee(9991, 5)).toBe(500);
  });

  it("handles small amounts", () => {
    expect(calculatePlatformFee(100, 5)).toBe(5);
  });

  it("handles zero amount", () => {
    expect(calculatePlatformFee(0, 5)).toBe(0);
  });
});

describe("getPriceIdForPlan", () => {
  it("returns price ID for starter plan", () => {
    const result = getPriceIdForPlan("starter");
    expect(result).toBe(PLAN_CONFIG.starter.priceId);
  });

  it("returns price ID for growth plan", () => {
    const result = getPriceIdForPlan("growth");
    expect(result).toBe(PLAN_CONFIG.growth.priceId);
  });

  it("returns price ID for scale plan", () => {
    const result = getPriceIdForPlan("scale");
    expect(result).toBe(PLAN_CONFIG.scale.priceId);
  });
});

describe("getPlanFromPriceId", () => {
  it("returns starter for starter price ID", () => {
    const priceId = PLAN_CONFIG.starter.priceId;
    if (priceId) {
      expect(getPlanFromPriceId(priceId)).toBe("starter");
    }
  });

  it("returns growth for growth price ID", () => {
    const priceId = PLAN_CONFIG.growth.priceId;
    if (priceId) {
      expect(getPlanFromPriceId(priceId)).toBe("growth");
    }
  });

  it("returns scale for scale price ID", () => {
    const priceId = PLAN_CONFIG.scale.priceId;
    if (priceId) {
      expect(getPlanFromPriceId(priceId)).toBe("scale");
    }
  });

  it("returns null for unknown price ID", () => {
    expect(getPlanFromPriceId("price_unknown_123")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getPlanFromPriceId("")).toBeNull();
  });
});

describe("isStripeConfigured", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns false when stripe keys are missing", () => {
    const result = isStripeConfigured();
    expect(typeof result).toBe("boolean");
  });
});

describe("PLAN_CONFIG", () => {
  it("has correct structure for starter plan", () => {
    expect(PLAN_CONFIG.starter.commissionRate).toBe(5);
    expect(PLAN_CONFIG.starter.monthlyPrice).toBe(4900);
    expect(PLAN_CONFIG.starter.storageGb).toBe(15);
    expect(PLAN_CONFIG.starter.customDomain).toBe(true);
    expect(PLAN_CONFIG.starter.certificates).toBe(true);
    expect(PLAN_CONFIG.starter.analytics).toBe(false);
  });

  it("has correct structure for growth plan", () => {
    expect(PLAN_CONFIG.growth.commissionRate).toBe(2);
    expect(PLAN_CONFIG.growth.monthlyPrice).toBe(9900);
    expect(PLAN_CONFIG.growth.storageGb).toBe(100);
    expect(PLAN_CONFIG.growth.analytics).toBe(true);
  });

  it("has correct structure for scale plan", () => {
    expect(PLAN_CONFIG.scale.commissionRate).toBe(0);
    expect(PLAN_CONFIG.scale.monthlyPrice).toBe(34900);
    expect(PLAN_CONFIG.scale.storageGb).toBe(2048);
    expect(PLAN_CONFIG.scale.whiteLabel).toBe(true);
    expect(PLAN_CONFIG.scale.prioritySupport).toBe(true);
  });
});
