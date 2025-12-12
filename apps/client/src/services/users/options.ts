import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import {
  UsersService,
  QUERY_KEYS,
  type UserListParams,
  type TenantUserListParams,
  type UpdateUserRequest,
  type UpdateTenantUserRequest,
  type InviteUserRequest,
  type BulkUpdateRoleRequest,
} from "./service";

export const usersListOptions = (params: UserListParams = {}) =>
  queryOptions({
    queryFn: () => UsersService.list(params),
    queryKey: QUERY_KEYS.USERS_LIST(params),
  });

export const tenantUsersListOptions = (params: TenantUserListParams = {}) =>
  queryOptions({
    queryFn: () => UsersService.listTenantUsers(params),
    queryKey: QUERY_KEYS.TENANT_USERS_LIST(params),
  });

export const userOptions = (id: string) =>
  queryOptions({
    queryFn: () => UsersService.getById(id),
    queryKey: QUERY_KEYS.USER(id),
    enabled: !!id,
  });

export const useUpdateUserOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateUserRequest) =>
      UsersService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(id) });
      toast.success(i18n.t("backoffice.users.edit.success"));
    },
  });
};

export const useDeleteUserOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: UsersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(i18n.t("backoffice.users.delete.success"));
    },
  });
};

export const useUpdateTenantUserOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & UpdateTenantUserRequest) =>
      UsersService.updateTenantUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANT_USERS });
      toast.success(i18n.t("dashboard.users.edit.success"));
    },
  });
};

export const useInviteUserOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: InviteUserRequest) => UsersService.inviteUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANT_USERS });
      toast.success(i18n.t("dashboard.users.invite.success"));
    },
  });
};

export const useDeleteTenantUserOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: UsersService.deleteTenantUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANT_USERS });
      toast.success(i18n.t("dashboard.users.delete.success"));
    },
  });
};

export const useBulkDeleteTenantUsersOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (ids: string[]) => UsersService.bulkDeleteTenantUsers(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANT_USERS });
      toast.success(
        i18n.t("dashboard.users.bulkDelete.success", { count: data.deleted })
      );
    },
  });
};

export const useBulkUpdateRoleOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: BulkUpdateRoleRequest) =>
      UsersService.bulkUpdateRole(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TENANT_USERS });
      toast.success(
        i18n.t("dashboard.users.bulkRole.success", { count: data.updated })
      );
    },
  });
};
