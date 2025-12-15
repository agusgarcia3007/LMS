import { http } from "@/lib/http";

export type TenantPlan = "starter" | "growth" | "scale";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "unpaid";
export type ConnectAccountStatus = "not_started" | "pending" | "active" | "restricted";

export type BackofficeSubscription = {
  id: string;
  tenantName: string;
  tenantSlug: string;
  plan: TenantPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
  trialEndsAt: string | null;
  commissionRate: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeConnectStatus: ConnectAccountStatus | null;
  chargesEnabled: boolean | null;
  payoutsEnabled: boolean | null;
  billingEmail: string | null;
  createdAt: string;
  usersCount: number;
  coursesCount: number;
};

export type SubscriptionHistoryEntry = {
  id: string;
  stripeSubscriptionId: string;
  stripeEventId: string;
  previousPlan: TenantPlan | null;
  newPlan: TenantPlan | null;
  previousStatus: SubscriptionStatus | null;
  newStatus: SubscriptionStatus | null;
  eventType: string;
  createdAt: string;
};

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SubscriptionsListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  plan?: string;
  status?: string;
  createdAt?: string;
  trialEndsAt?: string;
};

export type SubscriptionsResponse = {
  subscriptions: BackofficeSubscription[];
  pagination: PaginationInfo;
};

export type HistoryResponse = {
  history: SubscriptionHistoryEntry[];
};

export const QUERY_KEYS = {
  subscriptions: (params: SubscriptionsListParams) =>
    ["backoffice", "subscriptions", params] as const,
  history: (tenantId: string) =>
    ["backoffice", "subscriptions", tenantId, "history"] as const,
};

export async function getBackofficeSubscriptions(
  params: SubscriptionsListParams = {}
): Promise<SubscriptionsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.search) searchParams.set("search", params.search);
  if (params.plan) searchParams.set("plan", params.plan);
  if (params.status) searchParams.set("status", params.status);
  if (params.createdAt) searchParams.set("createdAt", params.createdAt);
  if (params.trialEndsAt) searchParams.set("trialEndsAt", params.trialEndsAt);

  const query = searchParams.toString();
  const { data } = await http.get<SubscriptionsResponse>(
    `/backoffice/subscriptions${query ? `?${query}` : ""}`
  );
  return data;
}

export async function getSubscriptionHistory(
  tenantId: string
): Promise<HistoryResponse> {
  const { data } = await http.get<HistoryResponse>(
    `/backoffice/subscriptions/${tenantId}/history`
  );
  return data;
}

export async function changePlan(
  tenantId: string,
  plan: TenantPlan
): Promise<{ tenant: BackofficeSubscription }> {
  const { data } = await http.put<{ tenant: BackofficeSubscription }>(
    `/backoffice/subscriptions/${tenantId}/plan`,
    { plan }
  );
  return data;
}

export async function cancelSubscription(
  tenantId: string,
  cancelImmediately = false
): Promise<{ success: boolean }> {
  const { data } = await http.post<{ success: boolean }>(
    `/backoffice/subscriptions/${tenantId}/cancel`,
    { cancelImmediately }
  );
  return data;
}

export async function extendTrial(
  tenantId: string,
  days: number
): Promise<{ tenant: BackofficeSubscription }> {
  const { data } = await http.post<{ tenant: BackofficeSubscription }>(
    `/backoffice/subscriptions/${tenantId}/extend-trial`,
    { days }
  );
  return data;
}

export async function updateCommissionRate(
  tenantId: string,
  commissionRate: number
): Promise<{ tenant: BackofficeSubscription }> {
  const { data } = await http.put<{ tenant: BackofficeSubscription }>(
    `/backoffice/subscriptions/${tenantId}/commission`,
    { commissionRate }
  );
  return data;
}
