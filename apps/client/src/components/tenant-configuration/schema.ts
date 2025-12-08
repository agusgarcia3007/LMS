import { z } from "zod";
import type { TenantTheme } from "@/services/tenants/service";

export const THEMES: { id: TenantTheme; color: string }[] = [
  { id: "default", color: "oklch(0.488 0.243 264.376)" },
  { id: "slate", color: "oklch(0.205 0 0)" },
  { id: "rose", color: "oklch(0.6 0.24 350)" },
  { id: "emerald", color: "oklch(0.7 0.17 162)" },
  { id: "tangerine", color: "oklch(0.64 0.17 36)" },
  { id: "ocean", color: "oklch(0.55 0.18 250)" },
];

export const configurationSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  name: z.string().min(1),
  description: z.string().max(500).optional(),
  contactEmail: z.email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  twitter: z.url().optional().or(z.literal("")),
  facebook: z.url().optional().or(z.literal("")),
  instagram: z.url().optional().or(z.literal("")),
  linkedin: z.url().optional().or(z.literal("")),
  youtube: z.url().optional().or(z.literal("")),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.string().optional(),
});

export type ConfigurationFormData = z.infer<typeof configurationSchema>;
