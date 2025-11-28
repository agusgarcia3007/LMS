import { useQuery } from "@tanstack/react-query";
import { tenantsOptions, tenantsListOptions, tenantOptions } from "./options";
import type { TenantListParams } from "./service";

export const useGetTenants = () => useQuery(tenantsOptions);

export const useGetTenantsList = (params: TenantListParams = {}) =>
  useQuery(tenantsListOptions(params));

export const useGetTenant = (slug: string) => useQuery(tenantOptions(slug));
