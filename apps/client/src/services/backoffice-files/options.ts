import { queryOptions } from "@tanstack/react-query";
import {
  QUERY_KEYS,
  getBackofficeFiles,
  getBackofficeTenants,
} from "./service";

export const backofficeFilesQueryOptions = (tenantId: string, type?: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.files(tenantId, type),
    queryFn: () => getBackofficeFiles(tenantId, type),
    enabled: !!tenantId,
  });

export const backofficeTenantsQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.tenants(),
    queryFn: getBackofficeTenants,
  });
