"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Users,
  BookOpen,
  GraduationCap,
  Certificate,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenant, useTenantStats } from "@/services/tenants";

export default function DashboardHomePage() {
  const { t } = useTranslation();
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const { data: tenantData } = useTenant(tenantSlug);
  const { data: statsData, isLoading: statsLoading } = useTenantStats(tenantData?.tenant?.id ?? "");

  const stats = statsData?.stats;
  const tenantName = tenantData?.tenant?.name ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("dashboard.home.welcome", { name: tenantName })}
        </h1>
        <p className="text-muted-foreground">{t("dashboard.home.description")}</p>
      </div>

      {statsLoading ? (
        <StatsGridSkeleton />
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("dashboard.stats.students")}
            value={stats.totalStudents}
            icon={Users}
            trend={stats.newStudents30d}
            trendLabel={t("dashboard.home.period.30d")}
          />
          <StatCard
            title={t("dashboard.stats.courses")}
            value={stats.totalCourses}
            icon={BookOpen}
          />
          <StatCard
            title={t("dashboard.stats.enrollments")}
            value={stats.totalEnrollments}
            icon={GraduationCap}
            trend={stats.newEnrollments30d}
            trendLabel={t("dashboard.home.period.30d")}
          />
          <StatCard
            title={t("dashboard.stats.completionRate")}
            value={`${Math.round(stats.completionRate)}%`}
            icon={Certificate}
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.home.activity.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.home.activity.noActivity")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.home.topCourses.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.home.topCourses.noCourses")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
};

function StatCard({ title, value, icon: Icon, trend, trendLabel }: StatCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            {trend !== undefined && trendLabel && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                {isPositive ? (
                  <TrendUp className="size-3 text-green-500" />
                ) : (
                  <TrendDown className="size-3 text-red-500" />
                )}
                <span className={isPositive ? "text-green-500" : "text-red-500"}>
                  +{trend}
                </span>
                <span className="text-muted-foreground">{trendLabel}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="size-12 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
