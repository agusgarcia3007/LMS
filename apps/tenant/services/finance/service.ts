import { http } from "@/lib/http";

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export type Subscription = {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  pricePerMonth: number;
  currency: string;
};

export type SubscriptionPlanDetails = {
  id: SubscriptionPlan;
  name: string;
  description: string;
  pricePerMonth: number;
  features: string[];
  maxCourses: number | null;
  maxStudents: number | null;
  maxStorage: number | null;
  recommended?: boolean;
};

export type RevenueMetrics = {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  currency: string;
};

export type RevenuePeriod = {
  period: string;
  revenue: number;
  orders: number;
};

export type RevenueTransaction = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: "completed" | "refunded" | "pending";
  createdAt: string;
};

export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export type Payout = {
  id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  method: string;
  createdAt: string;
  processedAt: string | null;
  reference: string | null;
};

export type PayoutSettings = {
  method: "bank_transfer" | "paypal" | "stripe" | null;
  bankName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  paypalEmail: string | null;
  stripeAccountId: string | null;
  minimumPayout: number;
  currency: string;
};

export type PayoutMetrics = {
  pendingAmount: number;
  totalPaidOut: number;
  nextPayoutDate: string | null;
  currency: string;
};

export const QUERY_KEYS = {
  SUBSCRIPTION: ["subscription"] as const,
  SUBSCRIPTION_PLANS: ["subscription-plans"] as const,
  REVENUE_METRICS: ["revenue-metrics"] as const,
  REVENUE_CHART: (period: string) => ["revenue-chart", period] as const,
  REVENUE_TRANSACTIONS: ["revenue-transactions"] as const,
  PAYOUTS: ["payouts"] as const,
  PAYOUT_SETTINGS: ["payout-settings"] as const,
  PAYOUT_METRICS: ["payout-metrics"] as const,
} as const;

export const FinanceService = {
  getSubscription: async () => {
    const response = await http.get<{ subscription: Subscription }>("/tenant/subscription");
    return response.data;
  },

  getSubscriptionPlans: async () => {
    const response = await http.get<{ plans: SubscriptionPlanDetails[] }>("/subscriptions/plans");
    return response.data;
  },

  updateSubscription: async (planId: SubscriptionPlan) => {
    const response = await http.put<{ subscription: Subscription }>("/tenant/subscription", { plan: planId });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await http.post<{ subscription: Subscription }>("/tenant/subscription/cancel");
    return response.data;
  },

  reactivateSubscription: async () => {
    const response = await http.post<{ subscription: Subscription }>("/tenant/subscription/reactivate");
    return response.data;
  },

  getRevenueMetrics: async () => {
    const response = await http.get<{ metrics: RevenueMetrics }>("/tenant/revenue/metrics");
    return response.data;
  },

  getRevenueChart: async (period: "7d" | "30d" | "90d" | "1y") => {
    const response = await http.get<{ data: RevenuePeriod[] }>(`/tenant/revenue/chart?period=${period}`);
    return response.data;
  },

  getRevenueTransactions: async () => {
    const response = await http.get<{ transactions: RevenueTransaction[] }>("/tenant/revenue/transactions");
    return response.data;
  },

  getPayouts: async () => {
    const response = await http.get<{ payouts: Payout[] }>("/tenant/payouts");
    return response.data;
  },

  getPayoutSettings: async () => {
    const response = await http.get<{ settings: PayoutSettings }>("/tenant/payouts/settings");
    return response.data;
  },

  updatePayoutSettings: async (data: Partial<PayoutSettings>) => {
    const response = await http.put<{ settings: PayoutSettings }>("/tenant/payouts/settings", data);
    return response.data;
  },

  getPayoutMetrics: async () => {
    const response = await http.get<{ metrics: PayoutMetrics }>("/tenant/payouts/metrics");
    return response.data;
  },

  requestPayout: async () => {
    const response = await http.post<{ payout: Payout }>("/tenant/payouts/request");
    return response.data;
  },
};
