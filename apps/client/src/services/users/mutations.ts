import { useMutation } from "@tanstack/react-query";
import {
  useUpdateUserOptions,
  useDeleteUserOptions,
  useUpdateTenantUserOptions,
  useInviteUserOptions,
  useDeleteTenantUserOptions,
  useBulkDeleteTenantUsersOptions,
  useBulkUpdateRoleOptions,
} from "./options";

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
