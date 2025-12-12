import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Calendar, CheckCircle, Ellipsis, FileText } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilterFieldConfig } from "@/components/ui/filters";
import { Skeleton } from "@/components/ui/skeleton";

import { StatusBadge } from "@/components/backoffice/status-badge";
import { DataTable } from "@/components/data-table";
import { useDataTableState } from "@/hooks/use-data-table-state";
import { createSeoMeta } from "@/lib/seo";
import {
  useGetBackofficeDocuments,
  type BackofficeDocument,
} from "@/services/dashboard";

export const Route = createFileRoute("/backoffice/documents")({
  head: () =>
    createSeoMeta({
      title: "Manage Documents",
      description: "Manage all LearnBase documents",
      noindex: true,
    }),
  component: BackofficeDocuments,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 10,
    sort: (search.sort as string) || undefined,
    search: (search.search as string) || undefined,
    tenantId: (search.tenantId as string) || undefined,
    status: (search.status as string) || undefined,
    createdAt: (search.createdAt as string) || undefined,
  }),
});

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function BackofficeDocuments() {
  const { t } = useTranslation();
  const tableState = useDataTableState({
    defaultSort: { field: "createdAt", order: "desc" },
  });

  const { data, isLoading } = useGetBackofficeDocuments({
    page: tableState.serverParams.page,
    limit: tableState.serverParams.limit,
    sort: tableState.serverParams.sort,
    search: tableState.serverParams.search,
    tenantId: tableState.serverParams.tenantId as string | undefined,
    status: tableState.serverParams.status as "draft" | "published" | undefined,
    createdAt: tableState.serverParams.createdAt as string | undefined,
  });

  const columns = useMemo<ColumnDef<BackofficeDocument>[]>(
    () => [
      {
        accessorKey: "title",
        id: "title",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.documents.columns.title")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10">
              <FileText className="size-4 text-orange-500" />
            </div>
            <div className="space-y-px">
              <div className="font-medium text-foreground">
                {row.original.title}
              </div>
              {row.original.fileName && (
                <div className="text-muted-foreground text-xs">
                  {row.original.fileName}
                </div>
              )}
            </div>
          </div>
        ),
        size: 300,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.documents.columns.title"),
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: "tenant",
        id: "tenant",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.documents.columns.tenant")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.tenant?.name ?? (
              <span className="text-muted-foreground">
                {t("common.noOrganization")}
              </span>
            )}
          </span>
        ),
        size: 180,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.documents.columns.tenant"),
          skeleton: <Skeleton className="h-4 w-28" />,
        },
      },
      {
        accessorKey: "fileSize",
        id: "fileSize",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.documents.columns.fileSize")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatFileSize(row.original.fileSize)}
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.documents.columns.fileSize"),
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.documents.columns.status")}
            column={column}
          />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 120,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.documents.columns.status"),
          skeleton: <Skeleton className="h-5 w-20" />,
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.documents.columns.createdAt")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
        size: 140,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.documents.columns.createdAt"),
          skeleton: <Skeleton className="h-4 w-24" />,
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-7" mode="icon" variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    `/${row.original.tenant?.slug}/content/documents`,
                    "_blank"
                  )
                }
                disabled={!row.original.tenant?.slug}
              >
                {t("backoffice.documents.actions.viewInTenant")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t]
  );

  const filterFields = useMemo<FilterFieldConfig[]>(
    () => [
      {
        key: "status",
        label: t("backoffice.documents.filters.status"),
        type: "multiselect",
        icon: <CheckCircle className="size-3.5" />,
        options: [
          { value: "draft", label: t("common.draft") },
          { value: "published", label: t("common.published") },
        ],
      },
      {
        key: "tenantId",
        label: t("backoffice.documents.filters.tenant"),
        type: "text",
        icon: <Building2 className="size-3.5" />,
        placeholder: t("backoffice.documents.filters.tenantPlaceholder"),
      },
      {
        key: "createdAt",
        label: t("backoffice.documents.filters.createdAt"),
        type: "daterange",
        icon: <Calendar className="size-3.5" />,
      },
    ],
    [t]
  );

  const documents = data?.documents ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("backoffice.documents.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("backoffice.documents.description")}
        </p>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        pagination={data?.pagination}
        isLoading={isLoading}
        tableState={tableState}
        filterFields={filterFields}
      />
    </div>
  );
}
