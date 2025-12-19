import { describe, it, expect } from "bun:test";
import { hasActiveSubscription } from "../../src/plugins/subscription";

describe("hasActiveSubscription", () => {
  it("returns true for active subscription", () => {
    const tenant = {
      subscriptionStatus: "active",
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(true);
  });

  it("returns true for trialing with future end date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const tenant = {
      subscriptionStatus: "trialing",
      trialEndsAt: futureDate,
    };

    expect(hasActiveSubscription(tenant)).toBe(true);
  });

  it("returns false for trialing with past end date", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const tenant = {
      subscriptionStatus: "trialing",
      trialEndsAt: pastDate,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });

  it("returns false for trialing without end date", () => {
    const tenant = {
      subscriptionStatus: "trialing",
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });

  it("returns false for canceled subscription", () => {
    const tenant = {
      subscriptionStatus: "canceled",
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });

  it("returns false for past_due subscription", () => {
    const tenant = {
      subscriptionStatus: "past_due",
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });

  it("returns false for null status", () => {
    const tenant = {
      subscriptionStatus: null,
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });

  it("returns false for unpaid subscription", () => {
    const tenant = {
      subscriptionStatus: "unpaid",
      trialEndsAt: null,
    };

    expect(hasActiveSubscription(tenant)).toBe(false);
  });
});
