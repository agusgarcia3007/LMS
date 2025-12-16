import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "./error-page";
import { getTenantFromHost, getResolvedSlug } from "@/lib/tenant";
import { CampusService, QUERY_KEYS } from "@/services/campus/service";
import { computeThemeStyles } from "@/lib/theme.server";
import { cn } from "@/lib/utils";

type TenantErrorProps = {
  error: Error;
  reset?: () => void;
  showDetails?: boolean;
  isNotFound?: boolean;
};

export function TenantErrorPage({
  error,
  reset,
  showDetails = false,
  isNotFound = false,
}: TenantErrorProps) {
  const { t } = useTranslation();
  const tenantInfo = getTenantFromHost();
  const slug = tenantInfo.slug || getResolvedSlug();

  const { data: tenantData } = useQuery({
    queryKey: QUERY_KEYS.TENANT,
    queryFn: () => CampusService.getTenant(),
    enabled: !!slug,
    retry: false,
    staleTime: Infinity,
  });

  const tenant = tenantData?.tenant ?? null;
  const { themeClass, customStyles } = computeThemeStyles(tenant);

  const logo = tenant?.logo ? (
    <img
      src={tenant.logo}
      alt={tenant.name}
      className="h-12 w-auto object-contain"
    />
  ) : tenant?.name ? (
    <span className="text-2xl font-bold">{tenant.name}</span>
  ) : null;

  return (
    <ErrorPage
      error={error}
      reset={reset}
      showDetails={showDetails}
      title={isNotFound ? t("errors.notFoundTitle") : t("errors.pageTitle")}
      description={
        isNotFound ? t("errors.notFoundDescription") : t("errors.pageDescription")
      }
      actionLabel={reset ? t("errors.tryAgain") : t("errors.backToCampus")}
      actionHref={reset ? undefined : "/"}
      logo={logo}
      className={cn(themeClass)}
      style={customStyles}
    />
  );
}
