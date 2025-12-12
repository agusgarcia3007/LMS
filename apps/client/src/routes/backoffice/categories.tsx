import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Calendar, Ellipsis, FolderTree } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
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

import { DataTable } from "@/components/data-table";
import { useDataTableState } from "@/hooks/use-data-table-state";
import { createSeoMeta } from "@/lib/seo";
import {
  useGetBackofficeCategories,
  type BackofficeCategory,
} from "@/services/dashboard";

export const Route = createFileRoute("/backoffice/categories")({
  head: () =>
    createSeoMeta({
      title: "Manage Categories",
      description: "Manage all LearnBase categories",
      noindex: true,
    }),
  component: BackofficeCategories,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 10,
    sort: (search.sort as string) || undefined,
    search: (search.search as string) || undefined,
    tenantId: (search.tenantId as string) || undefined,
    createdAt: (search.createdAt as string) || undefined,
  }),
});

function BackofficeCategories() {
  const { t } = useTranslation();
  const tableState = useDataTableState({
    defaultSort: { field: "createdAt", order: "desc" },
  });

  const { data, isLoading } = useGetBackofficeCategories({
    page: tableState.serverParams.page,
    limit: tableState.serverParams.limit,
    sort: tableState.serverParams.sort,
    search: tableState.serverParams.search,
    tenantId: tableState.serverParams.tenantId as string | undefined,
    createdAt: tableState.serverParams.createdAt as string | undefined,
  });

  const columns = useMemo<ColumnDef<BackofficeCategory>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.categories.columns.name")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <FolderTree className="size-4 text-primary" />
            </div>
            <div className="space-y-px">
              <div className="font-medium text-foreground">
                {row.original.name}
              </div>
              <div className="text-muted-foreground text-xs">
                {row.original.slug}
              </div>
            </div>
          </div>
        ),
        size: 280,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.categories.columns.name"),
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
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
            title={t("backoffice.categories.columns.tenant")}
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
          headerTitle: t("backoffice.categories.columns.tenant"),
          skeleton: <Skeleton className="h-4 w-28" />,
        },
      },
      {
        accessorKey: "coursesCount",
        id: "coursesCount",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.categories.columns.courses")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" size="sm">
            {row.original.coursesCount}{" "}
            {t("backoffice.categories.columns.coursesLabel")}
          </Badge>
        ),
        size: 120,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.categories.columns.courses"),
          skeleton: <Skeleton className="h-5 w-16" />,
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.categories.columns.createdAt")}
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
          headerTitle: t("backoffice.categories.columns.createdAt"),
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
                    `/${row.original.tenant?.slug}/content/categories`,
                    "_blank"
                  )
                }
                disabled={!row.original.tenant?.slug}
              >
                {t("backoffice.categories.actions.viewInTenant")}
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
        key: "tenantId",
        label: t("backoffice.categories.filters.tenant"),
        type: "text",
        icon: <Building2 className="size-3.5" />,
        placeholder: t("backoffice.categories.filters.tenantPlaceholder"),
      },
      {
        key: "createdAt",
        label: t("backoffice.categories.filters.createdAt"),
        type: "daterange",
        icon: <Calendar className="size-3.5" />,
      },
    ],
    [t]
  );

  const categories = data?.categories ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("backoffice.categories.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("backoffice.categories.description")}
        </p>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        pagination={data?.pagination}
        isLoading={isLoading}
        tableState={tableState}
        filterFields={filterFields}
      />
    </div>
  );
}
