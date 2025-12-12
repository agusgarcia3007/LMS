import { useTranslation } from "react-i18next";
import {
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/services/dashboard";
import { cn } from "@/lib/utils";

type StatsOverviewProps = {
  stats: DashboardStats | undefined;
  isLoading: boolean;
};

function GrowthIndicator({ value }: { value: number }) {
  const { t } = useTranslation();
  const isPositive = value >= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive ? "text-emerald-600" : "text-red-600"
      )}
    >
      {isPositive ? (
        <TrendingUp className="size-3" />
      ) : (
        <TrendingDown className="size-3" />
      )}
      <span>
        {isPositive ? "+" : ""}
        {value}%
      </span>
      <span className="text-muted-foreground font-normal">
        {t("backoffice.dashboard.vsLastPeriod")}
      </span>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  growth,
  isLoading,
  format = "number",
}: {
  title: string;
  value: number | undefined;
  icon: typeof Users;
  growth?: number;
  isLoading: boolean;
  format?: "number" | "currency" | "percent";
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `$${val.toLocaleString()}`;
      case "percent":
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {value !== undefined ? formatValue(value) : "-"}
            </div>
            {growth !== undefined && <GrowthIndicator value={growth} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("backoffice.dashboard.totalUsers")}
        value={stats?.overview.totalUsers}
        icon={Users}
        growth={stats?.growth.usersChange}
        isLoading={isLoading}
      />
      <StatCard
        title={t("backoffice.dashboard.totalTenants")}
        value={stats?.overview.totalTenants}
        icon={Building2}
        growth={stats?.growth.tenantsChange}
        isLoading={isLoading}
      />
      <StatCard
        title={t("backoffice.dashboard.totalCourses")}
        value={stats?.overview.totalCourses}
        icon={BookOpen}
        isLoading={isLoading}
      />
      <StatCard
        title={t("backoffice.dashboard.totalRevenue")}
        value={stats?.revenue.total}
        icon={DollarSign}
        isLoading={isLoading}
        format="currency"
      />
      <StatCard
        title={t("backoffice.dashboard.totalEnrollments")}
        value={stats?.overview.totalEnrollments}
        icon={GraduationCap}
        growth={stats?.growth.enrollmentsChange}
        isLoading={isLoading}
      />
      <StatCard
        title={t("backoffice.dashboard.activeUsers")}
        value={stats?.overview.activeUsers30d}
        icon={Users}
        isLoading={isLoading}
      />
      <StatCard
        title={t("backoffice.dashboard.completionRate")}
        value={stats?.engagement.avgCompletionRate}
        icon={TrendingUp}
        isLoading={isLoading}
        format="percent"
      />
      <StatCard
        title={t("backoffice.dashboard.certificates")}
        value={stats?.overview.totalCertificates}
        icon={Award}
        isLoading={isLoading}
      />
    </div>
  );
}
