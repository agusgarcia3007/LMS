import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TopTenant } from "@/services/dashboard";

type TopTenantsTableProps = {
  tenants: TopTenant[] | undefined;
  isLoading: boolean;
};

export function TopTenantsTable({ tenants, isLoading }: TopTenantsTableProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          {t("backoffice.dashboard.topTenants")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : !tenants || tenants.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {t("backoffice.dashboard.noTenantsYet")}
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant, index) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-muted-foreground w-5">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tenant.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" size="sm">
                    {tenant.usersCount} {t("backoffice.dashboard.users")}
                  </Badge>
                  <Badge variant="info" appearance="light" size="sm">
                    {tenant.coursesCount} {t("backoffice.dashboard.courses")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
