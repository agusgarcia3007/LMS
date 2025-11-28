import { useMutation } from "@tanstack/react-query";
import {
  createTenantOptions,
  updateTenantOptions,
  deleteTenantOptions,
} from "./options";

export const useCreateTenant = () => useMutation(createTenantOptions());

export const useUpdateTenant = () => useMutation(updateTenantOptions());

export const useDeleteTenant = () => useMutation(deleteTenantOptions());
