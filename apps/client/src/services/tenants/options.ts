import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import { QUERY_KEYS as PROFILE_QUERY_KEYS } from "@/services/profile/service";
import {
  TenantsService,
  QUERY_KEYS,
  type TenantListParams,
  type UpdateTenantRequest,
} from "./service";

export const tenantsOptions = queryOptions({
  queryFn: () => TenantsService.list(),
  queryKey: QUERY_KEYS.TENANTS,
});

export const tenantsListOptions = (params: TenantListParams = {}) =>
  queryOptions({
    queryFn: () => TenantsService.list(params),
    queryKey: QUERY_KEYS.TENANTS_LIST(params),
  });

export const tenantOptions = (slug: string) =>
  queryOptions({
    queryFn: () => TenantsService.getBySlug(slug),
    queryKey: QUERY_KEYS.TENANT(slug),
  });

export const createTenantOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: TenantsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANTS });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.PROFILE });
    },
  });
};

export const updateTenantOptions = (successMessage?: string) => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      id,
      slug,
      ...payload
    }: { id: string; slug?: string } & UpdateTenantRequest) =>
      TenantsService.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANTS });
      if (variables.slug) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TENANT(variables.slug),
        });
      }
      toast.success(
        successMessage ?? i18n.t("backoffice.tenants.edit.success")
      );
    },
  });
};

export const deleteTenantOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: TenantsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANTS });
      toast.success(i18n.t("backoffice.tenants.delete.success"));
    },
  });
};
