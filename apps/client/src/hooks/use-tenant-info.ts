import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTenantFromHost, setResolvedSlug, getResolvedSlug, type TenantInfo } from "@/lib/tenant";
import { CampusService, QUERY_KEYS } from "@/services/campus/service";

const subscribeToNothing = () => () => {};

const SERVER_SNAPSHOT: TenantInfo = {
  slug: null,
  isCampus: false,
  isCustomDomain: false,
};

let clientSnapshot: TenantInfo | null = null;

const getTenantSnapshot = (): TenantInfo => {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }
  if (!clientSnapshot) {
    clientSnapshot = getTenantFromHost();
  }
  return clientSnapshot;
};

const getServerSnapshot = (): TenantInfo => SERVER_SNAPSHOT;

export function useTenantInfo(): TenantInfo & { isResolving: boolean } {
  const baseInfo = useSyncExternalStore(
    subscribeToNothing,
    getTenantSnapshot,
    getServerSnapshot
  );

  const { data } = useQuery({
    queryKey: QUERY_KEYS.TENANT_RESOLVE,
    queryFn: async () => {
      const hostname = window.location.hostname;
      const result = await CampusService.resolveTenant(hostname);
      setResolvedSlug(result.tenant.slug);
      return result;
    },
    enabled: baseInfo.isCustomDomain && !getResolvedSlug(),
    staleTime: Infinity,
  });

  const resolvedSlug = data?.tenant?.slug || getResolvedSlug();

  if (baseInfo.isCustomDomain && resolvedSlug) {
    return {
      slug: resolvedSlug,
      isCampus: true,
      isCustomDomain: true,
      isResolving: false,
    };
  }

  return {
    ...baseInfo,
    isResolving: baseInfo.isCustomDomain && !resolvedSlug,
  };
}
