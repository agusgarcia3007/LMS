"use client";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { SpinnerGap, Check, Crown, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSubscription,
  useSubscriptionPlans,
  useUpdateSubscription,
  useCancelSubscription,
  useReactivateSubscription,
  type SubscriptionPlan,
} from "@/services/finance";

const PLAN_ICONS: Record<SubscriptionPlan, string> = {
  free: "",
  starter: "",
  pro: "",
  enterprise: "",
};

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscription();
  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const updateMutation = useUpdateSubscription();
  const cancelMutation = useCancelSubscription();
  const reactivateMutation = useReactivateSubscription();

  const isLoading = subscriptionLoading || plansLoading;

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  const subscription = subscriptionData?.subscription;
  const plans = plansData?.plans ?? [];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const handleUpgrade = (planId: SubscriptionPlan) => {
    updateMutation.mutate(planId);
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  const handleReactivate = () => {
    reactivateMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("finance.subscription.title")}</h1>
        <p className="text-muted-foreground">{t("finance.subscription.description")}</p>
      </div>

      {subscription && (
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">{t("finance.subscription.currentPlan")}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold capitalize">{subscription.plan}</span>
                {subscription.status === "active" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {t("finance.subscription.active")}
                  </span>
                )}
                {subscription.status === "trialing" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {t("finance.subscription.trial")}
                  </span>
                )}
                {subscription.status === "canceled" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    {t("finance.subscription.canceled")}
                  </span>
                )}
                {subscription.status === "past_due" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    {t("finance.subscription.pastDue")}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatCurrency(subscription.pricePerMonth, subscription.currency)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">{t("finance.subscription.billingPeriod")}</p>
              <p className="font-medium">
                {format(new Date(subscription.currentPeriodStart), "MMM d, yyyy")} -{" "}
                {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
              </p>
            </div>
            {subscription.trialEndsAt && (
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.subscription.trialEnds")}</p>
                <p className="font-medium">{format(new Date(subscription.trialEndsAt), "MMM d, yyyy")}</p>
              </div>
            )}
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <Warning className="size-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                {t("finance.subscription.cancelNotice", {
                  date: format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy"),
                })}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {subscription.cancelAtPeriodEnd ? (
              <Button onClick={handleReactivate} disabled={reactivateMutation.isPending}>
                {reactivateMutation.isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
                {t("finance.subscription.reactivate")}
              </Button>
            ) : (
              subscription.plan !== "free" && (
                <Button variant="outline" onClick={handleCancel} disabled={cancelMutation.isPending}>
                  {cancelMutation.isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
                  {t("finance.subscription.cancel")}
                </Button>
              )
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-4">{t("finance.subscription.availablePlans")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 space-y-4 ${
                plan.recommended ? "border-primary ring-2 ring-primary/20" : "border-border"
              } ${subscription?.plan === plan.id ? "bg-muted/50" : ""}`}
            >
              {plan.recommended && (
                <div className="flex items-center gap-1 text-primary text-sm font-medium">
                  <Crown className="size-4" />
                  {t("finance.subscription.recommended")}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold capitalize">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {formatCurrency(plan.pricePerMonth, "USD")}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                {subscription?.plan === plan.id ? (
                  <Button className="w-full" disabled>
                    {t("finance.subscription.currentPlan")}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
                    {subscription && plans.findIndex((p) => p.id === plan.id) > plans.findIndex((p) => p.id === subscription.plan)
                      ? t("finance.subscription.upgrade")
                      : t("finance.subscription.switch")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
