import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStats } from "@/services/dashboard";

export const Route = createFileRoute("/backoffice/")({
  component: BackofficeDashboard,
});

function BackofficeDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("backoffice.dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("backoffice.dashboard.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("backoffice.dashboard.totalUsers")}
            </CardTitle>
            <Users className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{data?.stats.totalUsers}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("backoffice.dashboard.totalTenants")}
            </CardTitle>
            <Building2 className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {data?.stats.totalTenants}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
