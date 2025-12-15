import { Elysia } from "elysia";
import { tenantPlugin } from "./tenant";
import { AppError, ErrorCode } from "@/lib/errors";

export function hasActiveSubscription(tenant: {
  subscriptionStatus: string | null;
  trialEndsAt: Date | null;
}): boolean {
  const status = tenant.subscriptionStatus;

  if (status === "active") {
    return true;
  }

  if (status === "trialing" && tenant.trialEndsAt) {
    return new Date() < new Date(tenant.trialEndsAt);
  }

  return false;
}

export const subscriptionGuard = new Elysia({ name: "subscriptionGuard" })
  .use(tenantPlugin)
  .derive({ as: "scoped" }, ({ tenant }) => {
    if (!tenant) {
      return { hasSubscription: false };
    }

    return {
      hasSubscription: hasActiveSubscription(tenant),
    };
  })
  .macro({
    requireSubscription(enabled: boolean) {
      if (!enabled) return;

      return {
        beforeHandle({ tenant, hasSubscription }) {
          if (!tenant) {
            throw new AppError(ErrorCode.NOT_FOUND, "Tenant not found", 404);
          }

          if (!hasSubscription) {
            throw new AppError(
              ErrorCode.PAYMENT_REQUIRED,
              "Subscription required. Please subscribe to continue.",
              402
            );
          }
        },
      };
    },
  });
