export type PlanTier = {
  key: string;
  price: string;
  priceInCents: number;
  commissionRate: number;
  storageGb: number;
  aiGeneration: "standard" | "unlimited";
  features: string[];
  featured?: boolean;
};

export const PLANS: PlanTier[] = [
  {
    key: "starter",
    price: "$49",
    priceInCents: 4900,
    commissionRate: 5,
    storageGb: 15,
    aiGeneration: "standard",
    features: [
      "unlimited_students",
      "unlimited_courses",
      "ai_standard",
      "storage_15",
      "custom_domain",
      "fee_5",
    ],
  },
  {
    key: "growth",
    price: "$99",
    priceInCents: 9900,
    commissionRate: 2,
    storageGb: 100,
    aiGeneration: "unlimited",
    featured: true,
    features: [
      "unlimited_students",
      "unlimited_courses",
      "ai_unlimited",
      "storage_100",
      "custom_domain",
      "fee_2",
    ],
  },
  {
    key: "scale",
    price: "$349",
    priceInCents: 34900,
    commissionRate: 0,
    storageGb: 2048,
    aiGeneration: "unlimited",
    features: [
      "unlimited_students",
      "unlimited_courses",
      "ai_unlimited",
      "storage_2tb",
      "custom_domain",
      "fee_0",
    ],
  },
];

export function getPlanByKey(key: string): PlanTier | undefined {
  return PLANS.find((plan) => plan.key === key);
}
