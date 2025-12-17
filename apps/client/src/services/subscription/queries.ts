import { useQuery } from "@tanstack/react-query";
import { subscriptionQueryOptions } from "./options";

type UseSubscriptionOptions = {
  enabled?: boolean;
};

export function useSubscription(options: UseSubscriptionOptions = {}) {
  return useQuery({
    ...subscriptionQueryOptions.subscription(),
    enabled: options.enabled ?? true,
  });
}

export function usePlans() {
  return useQuery(subscriptionQueryOptions.plans());
}
