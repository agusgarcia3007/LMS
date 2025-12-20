import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubscription } from "@/services/subscription";

function getDaysRemaining(trialEndsAt: string): number {
  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

type TrialBadgeProps = {
  tenantSlug: string;
};

export function TrialBadge({ tenantSlug }: TrialBadgeProps) {
  const { t } = useTranslation();
  const { data: subscription } = useSubscription();

  if (!subscription) {
    return null;
  }

  const isPastDue = subscription.subscriptionStatus === "past_due";
  const isTrialing = subscription.subscriptionStatus === "trialing";

  if (!isPastDue && !isTrialing) {
    return null;
  }

  const daysRemaining = subscription.trialEndsAt
    ? getDaysRemaining(subscription.trialEndsAt)
    : 0;

  const isUrgent = isPastDue || daysRemaining <= 2;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/$tenantSlug/finance/subscription"
          params={{ tenantSlug }}
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            isUrgent
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          <Clock className="size-3" />
          <span>
            {isPastDue
              ? t("subscription.trial.pastDueBadge")
              : t("subscription.trial.daysBadge", { count: daysRemaining })}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {isPastDue
          ? t("subscription.trial.pastDue")
          : t("subscription.trial.daysRemaining", { count: daysRemaining })}
        {" - "}
        {t("subscription.trial.clickToUpgrade")}
      </TooltipContent>
    </Tooltip>
  );
}
