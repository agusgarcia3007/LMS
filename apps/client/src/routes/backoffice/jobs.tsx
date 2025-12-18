import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useDataTableState } from "@/hooks/use-data-table-state";
import { createSeoMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  useJobs,
  useJobStats,
  useCleanupJobs,
  type Job,
  type JobStatus,
} from "@/services/jobs";

export const Route = createFileRoute("/backoffice/jobs")({
  head: () =>
    createSeoMeta({
      title: "Jobs Dashboard",
      description: "Monitor background job execution",
      noindex: true,
    }),
  component: BackofficeJobs,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 20,
    tab: (search.tab as "pending" | "executed") || "pending",
  }),
});

const STATUS_CONFIG: Record<
  JobStatus,
  { icon: typeof Clock; className: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: {
    icon: Clock,
    className: "text-yellow-600",
    badgeVariant: "outline",
  },
  processing: {
    icon: Loader2,
    className: "text-blue-600",
    badgeVariant: "secondary",
  },
  completed: {
    icon: CheckCircle,
    className: "text-green-600",
    badgeVariant: "default",
  },
  failed: {
    icon: XCircle,
    className: "text-red-600",
    badgeVariant: "destructive",
  },
};

function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatJobType(type: string): string {
  return type
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function BackofficeJobs() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "executed">(search.tab);

  const tableState = useDataTableState({
    defaultSort: { field: "createdAt", order: "desc" },
  });

  const { data, isLoading, refetch } = useJobs({
    page: tableState.serverParams.page,
    limit: tableState.serverParams.limit,
    tab: activeTab,
  });

  const { data: statsData, isLoading: statsLoading } = useJobStats();
  const cleanupMutation = useCleanupJobs();

  const handleTabChange = (tab: "pending" | "executed") => {
    setActiveTab(tab);
    navigate({ search: { ...search, tab, page: 1 } });
  };

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.id")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id.slice(0, 8)}...
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.jobs.columns.id"),
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: "jobType",
        id: "jobType",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.type")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {formatJobType(row.original.jobType)}
          </span>
        ),
        size: 200,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.jobs.columns.type"),
          skeleton: <Skeleton className="h-4 w-32" />,
        },
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.status")}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          const config = STATUS_CONFIG[status];
          const StatusIcon = config.icon;
          return (
            <Badge variant={config.badgeVariant} className="gap-1.5">
              <StatusIcon
                className={cn(
                  "size-3",
                  config.className,
                  status === "processing" && "animate-spin"
                )}
              />
              {t(`backoffice.jobs.status.${status}`)}
            </Badge>
          );
        },
        size: 140,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.jobs.columns.status"),
          skeleton: <Skeleton className="h-6 w-24 rounded-full" />,
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.created")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(row.original.createdAt), {
              addSuffix: true,
            })}
          </span>
        ),
        size: 150,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.jobs.columns.created"),
          skeleton: <Skeleton className="h-4 w-24" />,
        },
      },
      {
        accessorKey: "durationMs",
        id: "durationMs",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.duration")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {formatDuration(row.original.durationMs)}
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.jobs.columns.duration"),
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: "errorMessage",
        id: "errorMessage",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.jobs.columns.error")}
            column={column}
          />
        ),
        cell: ({ row }) =>
          row.original.errorMessage ? (
            <span className="text-sm text-destructive truncate max-w-xs block">
              {row.original.errorMessage}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
        size: 200,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.jobs.columns.error"),
          skeleton: <Skeleton className="h-4 w-32" />,
        },
      },
    ],
    [t]
  );

  const jobs = data?.jobs ?? [];
  const stats = statsData?.stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("backoffice.jobs.title")}</h1>
          <p className="text-muted-foreground">
            {t("backoffice.jobs.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4 mr-2" />
            {t("common.refresh")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => cleanupMutation.mutate()}
            disabled={cleanupMutation.isPending}
            isLoading={cleanupMutation.isPending}
          >
            <Trash2 className="size-4 mr-2" />
            {t("backoffice.jobs.cleanup")}
          </Button>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            label={t("backoffice.jobs.stats.total")}
            value={stats.total}
            icon={<Timer className="size-4" />}
          />
          <StatCard
            label={t("backoffice.jobs.stats.pending")}
            value={stats.pending}
            icon={<Clock className="size-4" />}
            className="text-yellow-600"
          />
          <StatCard
            label={t("backoffice.jobs.stats.processing")}
            value={stats.processing}
            icon={<Loader2 className="size-4" />}
            className="text-blue-600"
          />
          <StatCard
            label={t("backoffice.jobs.stats.completed")}
            value={stats.completed}
            icon={<CheckCircle className="size-4" />}
            className="text-green-600"
          />
          <StatCard
            label={t("backoffice.jobs.stats.failed")}
            value={stats.failed}
            icon={<AlertCircle className="size-4" />}
            className="text-red-600"
          />
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("pending")}
        >
          {t("backoffice.jobs.tabs.pending")}
          {stats && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
              {stats.pending + stats.processing}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === "executed" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("executed")}
        >
          {t("backoffice.jobs.tabs.executed")}
        </Button>
      </div>

      <DataTable
        data={jobs}
        columns={columns}
        pagination={data?.pagination}
        isLoading={isLoading}
        tableState={tableState}
        emptyState={{
          icon: <Clock className="size-12 text-muted-foreground" />,
          title: t("backoffice.jobs.empty.title"),
          description: t("backoffice.jobs.empty.description"),
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold", className)}>{value}</p>
    </div>
  );
}
