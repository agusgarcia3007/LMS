import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { createSeoMeta } from "@/lib/seo";
import {
  useGetDashboardStats,
  useGetTrends,
  useGetTopCourses,
  useGetTopTenants,
  type TrendPeriod,
} from "@/services/dashboard";

import { StatsOverview } from "@/components/backoffice/stats-overview";
import { GrowthCharts } from "@/components/backoffice/growth-charts";
import { TopCoursesTable } from "@/components/backoffice/top-courses-table";
import { TopTenantsTable } from "@/components/backoffice/top-tenants-table";
import { PeriodSelector } from "@/components/backoffice/period-selector";

export const Route = createFileRoute("/backoffice/")({
  head: () =>
    createSeoMeta({
      title: "Backoffice Dashboard",
      description: "LearnBase administration dashboard",
      noindex: true,
    }),
  component: BackofficeDashboard,
});

function BackofficeDashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<TrendPeriod>("30d");

  const { data: statsData, isLoading: statsLoading } = useGetDashboardStats();
  const { data: trendsData, isLoading: trendsLoading } = useGetTrends(period);
  const { data: coursesData, isLoading: coursesLoading } = useGetTopCourses(5);
  const { data: tenantsData, isLoading: tenantsLoading } = useGetTopTenants(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("backoffice.dashboard.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("backoffice.dashboard.description")}
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <StatsOverview stats={statsData?.stats} isLoading={statsLoading} />

      <GrowthCharts trends={trendsData?.trends} isLoading={trendsLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <TopCoursesTable
          courses={coursesData?.courses}
          isLoading={coursesLoading}
        />
        <TopTenantsTable
          tenants={tenantsData?.tenants}
          isLoading={tenantsLoading}
        />
      </div>
    </div>
  );
}
