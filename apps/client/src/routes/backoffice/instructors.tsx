import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Calendar, Ellipsis } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  useGetBackofficeInstructors,
  type BackofficeInstructor,
} from "@/services/dashboard";

export const Route = createFileRoute("/backoffice/instructors")({
  head: () =>
    createSeoMeta({
      title: "Manage Instructors",
      description: "Manage all LearnBase instructors",
      noindex: true,
    }),
  component: BackofficeInstructors,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 10,
    sort: (search.sort as string) || undefined,
    search: (search.search as string) || undefined,
    tenantId: (search.tenantId as string) || undefined,
    createdAt: (search.createdAt as string) || undefined,
  }),
});

function BackofficeInstructors() {
  const { t } = useTranslation();
  const tableState = useDataTableState({
    defaultSort: { field: "createdAt", order: "desc" },
  });

  const { data, isLoading } = useGetBackofficeInstructors({
    page: tableState.serverParams.page,
    limit: tableState.serverParams.limit,
    sort: tableState.serverParams.sort,
    search: tableState.serverParams.search,
    tenantId: tableState.serverParams.tenantId as string | undefined,
    createdAt: tableState.serverParams.createdAt as string | undefined,
  });

  const columns = useMemo<ColumnDef<BackofficeInstructor>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.instructors.columns.name")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage
                src={row.original.avatar ?? undefined}
                alt={row.original.name}
              />
              <AvatarFallback>
                {row.original.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-px">
              <div className="font-medium text-foreground">
                {row.original.name}
              </div>
              {row.original.title && (
                <div className="text-muted-foreground text-xs">
                  {row.original.title}
                </div>
              )}
            </div>
          </div>
        ),
        size: 280,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.instructors.columns.name"),
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: "email",
        id: "email",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.instructors.columns.email")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.email ?? "-"}
          </span>
        ),
        size: 200,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.instructors.columns.email"),
          skeleton: <Skeleton className="h-4 w-36" />,
        },
      },
      {
        accessorKey: "tenant",
        id: "tenant",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.instructors.columns.tenant")}
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
          headerTitle: t("backoffice.instructors.columns.tenant"),
          skeleton: <Skeleton className="h-4 w-28" />,
        },
      },
      {
        accessorKey: "coursesCount",
        id: "coursesCount",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.instructors.columns.courses")}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" size="sm">
            {row.original.coursesCount}{" "}
            {t("backoffice.instructors.columns.coursesLabel")}
          </Badge>
        ),
        size: 120,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.instructors.columns.courses"),
          skeleton: <Skeleton className="h-5 w-16" />,
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t("backoffice.instructors.columns.createdAt")}
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
          headerTitle: t("backoffice.instructors.columns.createdAt"),
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
                    `/${row.original.tenant?.slug}/content/instructors`,
                    "_blank"
                  )
                }
                disabled={!row.original.tenant?.slug}
              >
                {t("backoffice.instructors.actions.viewInTenant")}
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
        label: t("backoffice.instructors.filters.tenant"),
        type: "text",
        icon: <Building2 className="size-3.5" />,
        placeholder: t("backoffice.instructors.filters.tenantPlaceholder"),
      },
      {
        key: "createdAt",
        label: t("backoffice.instructors.filters.createdAt"),
        type: "daterange",
        icon: <Calendar className="size-3.5" />,
      },
    ],
    [t]
  );

  const instructors = data?.instructors ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("backoffice.instructors.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("backoffice.instructors.description")}
        </p>
      </div>

      <DataTable
        data={instructors}
        columns={columns}
        pagination={data?.pagination}
        isLoading={isLoading}
        tableState={tableState}
        filterFields={filterFields}
      />
    </div>
  );
}
