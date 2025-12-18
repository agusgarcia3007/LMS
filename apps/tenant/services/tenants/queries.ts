"use client";

import { useQuery } from "@tanstack/react-query";
import { TenantsService, QUERY_KEYS, type TenantTrendPeriod } from "./service";

export function useTenant(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT(slug),
    queryFn: () => TenantsService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useTenantStats(tenantId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT_STATS(tenantId),
    queryFn: () => TenantsService.getStats(tenantId),
    enabled: !!tenantId,
  });
}

export function useTenantOnboarding(tenantId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT_ONBOARDING(tenantId),
    queryFn: () => TenantsService.getOnboarding(tenantId),
    enabled: !!tenantId,
  });
}

export function useTenantTrends(tenantId: string, period: TenantTrendPeriod = "30d") {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT_TRENDS(tenantId, period),
    queryFn: () => TenantsService.getTrends(tenantId, period),
    enabled: !!tenantId,
  });
}

export function useTenantTopCourses(tenantId: string, limit = 5) {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT_TOP_COURSES(tenantId, limit),
    queryFn: () => TenantsService.getTopCourses(tenantId, limit),
    enabled: !!tenantId,
  });
}

export function useTenantActivity(tenantId: string, limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.TENANT_ACTIVITY(tenantId, limit),
    queryFn: () => TenantsService.getActivity(tenantId, limit),
    enabled: !!tenantId,
  });
}
