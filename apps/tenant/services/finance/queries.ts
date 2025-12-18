import { useQuery } from "@tanstack/react-query";
import { FinanceService, QUERY_KEYS } from "./service";

export function useSubscription() {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION,
    queryFn: FinanceService.getSubscription,
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION_PLANS,
    queryFn: FinanceService.getSubscriptionPlans,
  });
}

export function useRevenueMetrics() {
  return useQuery({
    queryKey: QUERY_KEYS.REVENUE_METRICS,
    queryFn: FinanceService.getRevenueMetrics,
  });
}

export function useRevenueChart(period: "7d" | "30d" | "90d" | "1y") {
  return useQuery({
    queryKey: QUERY_KEYS.REVENUE_CHART(period),
    queryFn: () => FinanceService.getRevenueChart(period),
  });
}

export function useRevenueTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.REVENUE_TRANSACTIONS,
    queryFn: FinanceService.getRevenueTransactions,
  });
}

export function usePayouts() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYOUTS,
    queryFn: FinanceService.getPayouts,
  });
}

export function usePayoutSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYOUT_SETTINGS,
    queryFn: FinanceService.getPayoutSettings,
  });
}

export function usePayoutMetrics() {
  return useQuery({
    queryKey: QUERY_KEYS.PAYOUT_METRICS,
    queryFn: FinanceService.getPayoutMetrics,
  });
}
