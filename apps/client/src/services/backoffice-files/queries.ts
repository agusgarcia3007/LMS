import { useQuery } from "@tanstack/react-query";
import {
  backofficeFilesQueryOptions,
  backofficeTenantsQueryOptions,
} from "./options";

export function useBackofficeFiles(tenantId: string, type?: string) {
  return useQuery(backofficeFilesQueryOptions(tenantId, type));
}

export function useBackofficeTenants() {
  return useQuery(backofficeTenantsQueryOptions());
}
