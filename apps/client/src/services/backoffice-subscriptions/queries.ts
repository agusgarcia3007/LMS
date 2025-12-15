import { useQuery } from "@tanstack/react-query";
import {
  backofficeSubscriptionsQueryOptions,
  subscriptionHistoryQueryOptions,
} from "./options";
import type { SubscriptionsListParams } from "./service";

export function useBackofficeSubscriptions(params: SubscriptionsListParams) {
  return useQuery(backofficeSubscriptionsQueryOptions(params));
}

export function useSubscriptionHistory(tenantId: string) {
  return useQuery(subscriptionHistoryQueryOptions(tenantId));
}
