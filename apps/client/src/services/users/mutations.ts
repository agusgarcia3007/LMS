import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  useUpdateUserOptions,
  useDeleteUserOptions,
  useUpdateTenantUserOptions,
  useInviteUserOptions,
  useDeleteTenantUserOptions,
  useBulkDeleteTenantUsersOptions,
  useBulkUpdateRoleOptions,
} from "./options";
import { UsersService } from "./service";
import { startImpersonation } from "@/lib/http";
import { QUERY_KEYS as PROFILE_KEYS } from "@/services/profile/service";

export const useUpdateUser = () => useMutation(useUpdateUserOptions());

export const useDeleteUser = () => useMutation(useDeleteUserOptions());

export const useUpdateTenantUser = () =>
  useMutation(useUpdateTenantUserOptions());

export const useInviteUser = () => useMutation(useInviteUserOptions());

export const useDeleteTenantUser = () =>
  useMutation(useDeleteTenantUserOptions());

export const useBulkDeleteTenantUsers = () =>
  useMutation(useBulkDeleteTenantUsersOptions());

export const useBulkUpdateRole = () => useMutation(useBulkUpdateRoleOptions());

export const useImpersonate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: UsersService.impersonate,
    onSuccess: (data) => {
      const currentAccess = localStorage.getItem("accessToken");
      const currentRefresh = localStorage.getItem("refreshToken");
      if (!currentAccess || !currentRefresh) return;

      startImpersonation(
        currentAccess,
        currentRefresh,
        data.accessToken,
        data.refreshToken,
        {
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
          tenantSlug: data.user.tenantSlug,
        }
      );

      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.PROFILE });

      if (data.user.role === "student") {
        navigate({ to: "/my-courses" });
      } else if (data.user.tenantSlug) {
        navigate({ to: "/$tenantSlug", params: { tenantSlug: data.user.tenantSlug } });
      } else {
        navigate({ to: "/" });
      }
    },
  });
};
