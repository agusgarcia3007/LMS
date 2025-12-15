import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { createSeoMeta } from "@/lib/seo";
import {
  useSubscription,
  usePlans,
  useCreateSubscription,
  useCreatePortalSession,
} from "@/services/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import {
  Check,
  CreditCard,
  Loader2,
  Sparkles,
  X,
  Users,
  BookOpen,
  HardDrive,
  Cpu,
  Percent,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanInfo, TenantPlan } from "@/services/billing/service";

export const Route = createFileRoute("/$tenantSlug/billing")({
  head: () =>
    createSeoMeta({
      title: "Billing",
      description: "Manage your subscription",
      noindex: true,
    }),
  component: BillingPage,
});

function FeatureItem({
  icon: Icon,
  label,
  highlighted = false,
}: {
  icon: typeof Users;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          highlighted
            ? "bg-primary/10 ring-1 ring-primary/20"
            : "bg-muted/50 ring-1 ring-border/50"
        )}
      >
        <Icon
          className={cn(
            "size-4",
            highlighted ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </li>
  );
}

function FeatureRow({ included, label }: { included: boolean; label: string }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 py-1 transition-opacity",
        !included && "opacity-50"
      )}
    >
      {included ? (
        <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Check className="size-3 text-emerald-500" />
        </div>
      ) : (
        <div className="flex size-5 items-center justify-center rounded-full bg-muted ring-1 ring-border/50">
          <X className="size-3 text-muted-foreground" />
        </div>
      )}
      <span
        className={cn(
          "text-sm",
          included ? "text-foreground" : "text-muted-foreground line-through"
        )}
      >
        {label}
      </span>
    </li>
  );
}

function PlanCard({
  plan,
  isCurrentPlan,
  isRecommended,
  onSelect,
  onManage,
  isLoading,
  hasSubscription,
  t,
}: {
  plan: PlanInfo;
  isCurrentPlan: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  onManage: () => void;
  isLoading: boolean;
  hasSubscription: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border-0 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-black/20",
        isRecommended && "ring-2 ring-primary shadow-primary/10",
        isCurrentPlan && !isRecommended && "ring-2 ring-emerald-500/50"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          isRecommended
            ? "bg-gradient-to-r from-primary via-primary to-primary/60"
            : isCurrentPlan
              ? "bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-500/60"
              : "bg-gradient-to-r from-border via-border/80 to-border"
        )}
      />

      {isRecommended && (
        <div className="absolute -top-0.5 left-1/2 z-10 -translate-x-1/2 translate-y-3">
          <Badge className="gap-1.5 bg-primary px-4 py-1 text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="size-3.5" />
            {t("billing.plans.recommended")}
          </Badge>
        </div>
      )}

      <div
        className={cn(
          "border-b border-border/50 px-6 pb-6 pt-8 text-center",
          isRecommended && "pt-12"
        )}
      >
        <h3 className="text-xl font-semibold text-foreground">
          {t(`billing.plans.${plan.id}`)}
        </h3>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold tracking-tight text-foreground">
            {formatPrice(plan.monthlyPrice, "USD")}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("billing.perMonth")}
          </span>
        </div>
        {isCurrentPlan && (
          <Badge
            variant="outline"
            className="mt-4 gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {t("billing.currentPlan")}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <ul className="space-y-3">
          <FeatureItem
            icon={Users}
            label={
              plan.maxStudents
                ? t("billing.features.maxStudents", { count: plan.maxStudents })
                : t("billing.features.unlimitedStudents")
            }
            highlighted
          />
          <FeatureItem
            icon={BookOpen}
            label={
              plan.maxCourses
                ? t("billing.features.maxCourses", { count: plan.maxCourses })
                : t("billing.features.unlimitedCourses")
            }
            highlighted
          />
          <FeatureItem
            icon={HardDrive}
            label={t("billing.features.storage", { size: plan.storageGb })}
            highlighted
          />
          <FeatureItem
            icon={Cpu}
            label={t("billing.features.ai", {
              type: t(`billing.aiTypes.${plan.aiGeneration}`),
            })}
            highlighted
          />
          <FeatureItem
            icon={Percent}
            label={t("billing.features.commission", {
              rate: plan.commissionRate,
            })}
            highlighted
          />
        </ul>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <ul className="flex-1 space-y-2">
          <FeatureRow
            included={plan.certificates}
            label={t("billing.features.certificates")}
          />
          <FeatureRow
            included={plan.customDomain}
            label={t("billing.features.customDomain")}
          />
          <FeatureRow
            included={plan.analytics}
            label={t("billing.features.analytics")}
          />
          <FeatureRow
            included={plan.prioritySupport}
            label={t("billing.features.prioritySupport")}
          />
          <FeatureRow
            included={plan.whiteLabel}
            label={t("billing.features.whiteLabel")}
          />
        </ul>

        <div className="mt-6">
          {isCurrentPlan && hasSubscription ? (
            <Button
              variant="outline"
              className="w-full gap-2 border-border/60 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
              onClick={onManage}
              isLoading={isLoading}
            >
              <CreditCard className="size-4" />
              {t("billing.manageBilling")}
            </Button>
          ) : isCurrentPlan ? (
            <Button variant="outline" className="w-full" disabled>
              {t("billing.currentPlan")}
            </Button>
          ) : (
            <Button
              className={cn(
                "group/btn w-full gap-2 transition-all duration-300",
                isRecommended
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                  : "bg-secondary hover:bg-secondary/80"
              )}
              variant={isRecommended ? "default" : "secondary"}
              onClick={onSelect}
              isLoading={isLoading}
            >
              {t("billing.selectPlan")}
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const variants: Record<
    string,
    { bg: string; text: string; dot: string; ring: string }
  > = {
    active: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
      ring: "border-emerald-500/30",
    },
    trialing: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
      ring: "border-blue-500/30",
    },
    past_due: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      ring: "border-amber-500/30",
    },
    canceled: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
      ring: "border-red-500/30",
    },
    unpaid: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
      ring: "border-red-500/30",
    },
  };

  const variant = variants[status] || variants.active;

  return (
    <Badge
      className={cn(
        "gap-1.5 border shadow-sm",
        variant.bg,
        variant.text,
        variant.ring
      )}
    >
      <span className="relative flex size-2">
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            variant.dot
          )}
        />
        <span
          className={cn("relative inline-flex size-2 rounded-full", variant.dot)}
        />
      </span>
      {t(`billing.status.${status}`)}
    </Badge>
  );
}

function BillingPage() {
  const { t } = useTranslation();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscription();
  const { data: plansData, isLoading: isLoadingPlans } = usePlans();
  const { mutate: createSubscription, isPending: isCreating } =
    useCreateSubscription();
  const { mutate: createPortal, isPending: isOpeningPortal } =
    useCreatePortalSession();

  const handleSelectPlan = (plan: TenantPlan) => {
    createSubscription(plan, {
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
    });
  };

  const handleManageBilling = () => {
    createPortal(undefined, {
      onSuccess: (data) => {
        window.location.href = data.portalUrl;
      },
    });
  };

  if (isLoadingSubscription || isLoadingPlans) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <Loader2 className="relative size-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan;
  const status = subscription?.subscriptionStatus;
  const hasSubscription = Boolean(subscription?.stripeCustomerId);
  const plans = plansData?.plans ?? [];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-muted/50 via-background to-background p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {t("billing.title")}
              </h1>
              <p className="text-muted-foreground">{t("billing.description")}</p>
            </div>
          </div>
          {status && <StatusBadge status={status} />}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isRecommended = plan.id === "growth";

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={isCurrentPlan}
              isRecommended={isRecommended}
              onSelect={() => handleSelectPlan(plan.id as TenantPlan)}
              onManage={handleManageBilling}
              isLoading={isCreating || isOpeningPortal}
              hasSubscription={hasSubscription}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}
