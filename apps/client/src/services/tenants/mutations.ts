import { useMutation } from "@tanstack/react-query";
import {
  createTenantOptions,
  updateTenantOptions,
  deleteTenantOptions,
} from "./options";

export const useCreateTenant = () => useMutation(createTenantOptions());

export const useUpdateTenant = (successMessage?: string) =>
  useMutation(updateTenantOptions(successMessage));

export const useDeleteTenant = () => useMutation(deleteTenantOptions());
