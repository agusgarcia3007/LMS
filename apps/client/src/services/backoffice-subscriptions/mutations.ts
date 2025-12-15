import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePlan,
  cancelSubscription,
  extendTrial,
  updateCommissionRate,
  type TenantPlan,
} from "./service";

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, plan }: { tenantId: string; plan: TenantPlan }) =>
      changePlan(tenantId, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backoffice", "subscriptions"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      cancelImmediately,
    }: {
      tenantId: string;
      cancelImmediately?: boolean;
    }) => cancelSubscription(tenantId, cancelImmediately),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backoffice", "subscriptions"] });
    },
  });
}

export function useExtendTrial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, days }: { tenantId: string; days: number }) =>
      extendTrial(tenantId, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backoffice", "subscriptions"] });
    },
  });
}

export function useUpdateCommissionRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      commissionRate,
    }: {
      tenantId: string;
      commissionRate: number;
    }) => updateCommissionRate(tenantId, commissionRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backoffice", "subscriptions"] });
    },
  });
}
