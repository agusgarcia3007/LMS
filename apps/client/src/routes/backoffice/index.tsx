import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";

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
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("backoffice.dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("backoffice.dashboard.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <CalendarDays className="size-3.5" />
            <span>{t("backoffice.dashboard.showingDataFor")}</span>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
      </header>

      <StatsOverview stats={statsData?.stats} isLoading={statsLoading} />

      <GrowthCharts trends={trendsData?.trends} isLoading={trendsLoading} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-muted/20 p-5">
          <TopCoursesTable
            courses={coursesData?.courses}
            isLoading={coursesLoading}
          />
        </div>
        <div className="rounded-xl bg-muted/20 p-5">
          <TopTenantsTable
            tenants={tenantsData?.tenants}
            isLoading={tenantsLoading}
          />
        </div>
      </section>
    </div>
  );
}
