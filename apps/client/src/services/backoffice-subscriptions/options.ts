import { queryOptions } from "@tanstack/react-query";
import {
  QUERY_KEYS,
  getBackofficeSubscriptions,
  getSubscriptionHistory,
  type SubscriptionsListParams,
} from "./service";

export const backofficeSubscriptionsQueryOptions = (
  params: SubscriptionsListParams
) =>
  queryOptions({
    queryKey: QUERY_KEYS.subscriptions(params),
    queryFn: () => getBackofficeSubscriptions(params),
  });

export const subscriptionHistoryQueryOptions = (tenantId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.history(tenantId),
    queryFn: () => getSubscriptionHistory(tenantId),
    enabled: !!tenantId,
  });
