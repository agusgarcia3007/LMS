import { useQuery } from "@tanstack/react-query";
import {
  tenantsOptions,
  tenantsListOptions,
  tenantOptions,
  tenantStatsOptions,
  tenantOnboardingOptions,
  verifyDomainOptions,
  tenantTrendsOptions,
  tenantTopCoursesOptions,
  tenantActivityOptions,
} from "./options";
import type { TenantListParams, TenantTrendPeriod } from "./service";

export const useGetTenants = () => useQuery(tenantsOptions);

export const useGetTenantsList = (params: TenantListParams = {}) =>
  useQuery(tenantsListOptions(params));

export const useGetTenant = (slug: string) => useQuery(tenantOptions(slug));

export const useGetTenantStats = (id: string) =>
  useQuery(tenantStatsOptions(id));

export const useGetOnboarding = (id: string) =>
  useQuery(tenantOnboardingOptions(id));

export const useVerifyDomain = (tenantId: string, enabled: boolean) =>
  useQuery(verifyDomainOptions(tenantId, enabled));

export const useGetTenantTrends = (id: string, period: TenantTrendPeriod = "30d") =>
  useQuery(tenantTrendsOptions(id, period));

export const useGetTenantTopCourses = (id: string, limit = 5) =>
  useQuery(tenantTopCoursesOptions(id, limit));

export const useGetTenantActivity = (id: string, limit = 10) =>
  useQuery(tenantActivityOptions(id, limit));
