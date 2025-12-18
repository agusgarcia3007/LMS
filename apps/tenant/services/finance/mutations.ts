import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  FinanceService,
  QUERY_KEYS,
  type SubscriptionPlan,
  type PayoutSettings,
} from "./service";

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (planId: SubscriptionPlan) => FinanceService.updateSubscription(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIPTION });
      toast.success(t("finance.subscription.updateSuccess"));
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => FinanceService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIPTION });
      toast.success(t("finance.subscription.cancelSuccess"));
    },
  });
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => FinanceService.reactivateSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIPTION });
      toast.success(t("finance.subscription.reactivateSuccess"));
    },
  });
}

export function useUpdatePayoutSettings() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: Partial<PayoutSettings>) => FinanceService.updatePayoutSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYOUT_SETTINGS });
      toast.success(t("finance.payouts.settingsUpdateSuccess"));
    },
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => FinanceService.requestPayout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYOUTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYOUT_METRICS });
      toast.success(t("finance.payouts.requestSuccess"));
    },
  });
}
