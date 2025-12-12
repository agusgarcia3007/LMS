import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, BookOpen, Users, BarChart3 } from "lucide-react";
import { getCampusUrl } from "@/lib/tenant";
import { createSeoMeta } from "@/lib/seo";
import {
  useGetTenantStats,
  useGetOnboarding,
  useGetTenantTrends,
  useGetTenantTopCourses,
  useGetTenantActivity,
  type TenantTrendPeriod,
} from "@/services/tenants";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { TopCoursesTable } from "@/components/dashboard/top-courses-table";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const Route = createFileRoute("/$tenantSlug/")({
  head: () =>
    createSeoMeta({
      title: "Dashboard",
      description: "Manage your academy",
      noindex: true,
    }),
  component: DashboardHome,
});

function DashboardHome() {
  const { t } = useTranslation();
  const { tenant } = Route.useRouteContext();
  const campusUrl = getCampusUrl(tenant.slug, tenant.customDomain);
  const [period, setPeriod] = useState<TenantTrendPeriod>("30d");

  const { data: statsData, isLoading: isLoadingStats } = useGetTenantStats(
    tenant.id
  );
  const { data: onboardingData } = useGetOnboarding(tenant.id);
  const { data: trendsData, isLoading: isLoadingTrends } = useGetTenantTrends(
    tenant.id,
    period
  );
  const { data: topCoursesData, isLoading: isLoadingTopCourses } =
    useGetTenantTopCourses(tenant.id, 5);
  const { data: activityData, isLoading: isLoadingActivity } =
    useGetTenantActivity(tenant.id, 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("dashboard.home.welcome", { name: tenant.name })}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("dashboard.home.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodSelector value={period} onChange={setPeriod} />
          <a href={campusUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="size-4" />
              {t("dashboard.home.viewCampus")}
            </Button>
          </a>
        </div>
      </div>

      {onboardingData?.steps && (
        <OnboardingChecklist
          tenantSlug={tenant.slug}
          steps={onboardingData.steps}
        />
      )}

      <QuickActions tenantSlug={tenant.slug} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.home.stats.courses")}
            </CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {statsData?.stats.totalCourses}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t("dashboard.home.stats.coursesPublished")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.home.stats.students")}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {statsData?.stats.totalStudents}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t("dashboard.home.stats.studentsRegistered")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.home.stats.revenue")}
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                ${statsData?.stats.totalRevenue}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t("dashboard.home.stats.thisMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts trends={trendsData?.trends} isLoading={isLoadingTrends} />

      <div className="grid gap-4 md:grid-cols-2">
        <TopCoursesTable
          courses={topCoursesData?.courses}
          isLoading={isLoadingTopCourses}
        />
        <RecentActivity
          activities={activityData?.activities}
          isLoading={isLoadingActivity}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.home.yourCampus.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.home.yourCampus.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm">
              {campusUrl}
            </code>
            <a href={campusUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="size-3.5" />
                {t("dashboard.home.yourCampus.open")}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
