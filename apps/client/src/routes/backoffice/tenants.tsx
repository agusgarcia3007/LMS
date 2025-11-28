import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTableToolbar, DeleteDialog, DataTableEmpty } from "@/components/data-table";
import { useDataTableState } from "@/hooks/use-data-table-state";
import { useGetTenantsList, useDeleteTenant, useUpdateTenant } from "@/services/tenants";
import type { Tenant } from "@/services/tenants/service";
import { EditTenantDialog } from "./-components/edit-tenant-dialog";

export const Route = createFileRoute("/backoffice/tenants")({
  component: BackofficeTenants,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 10,
    sort: (search.sort as string) || undefined,
    search: (search.search as string) || undefined,
  }),
});

function BackofficeTenants() {
  const { t } = useTranslation();
  const { params, sortState, setPage, setLimit, setSort, setSearch } =
    useDataTableState({
      defaultSort: { field: "createdAt", order: "desc" },
    });

  const { data, isLoading } = useGetTenantsList({
    page: params.page,
    limit: params.limit,
    sort: params.sort,
    search: params.search,
  });

  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [deleteTenant, setDeleteTenant] = useState<Tenant | null>(null);

  const updateMutation = useUpdateTenant();
  const deleteMutation = useDeleteTenant();

  const handleDelete = () => {
    if (!deleteTenant) return;
    deleteMutation.mutate(deleteTenant.id, {
      onSuccess: () => setDeleteTenant(null),
    });
  };

  const handleUpdate = (data: { name: string }) => {
    if (!editTenant) return;
    updateMutation.mutate(
      { id: editTenant.id, ...data },
      { onSuccess: () => setEditTenant(null) }
    );
  };

  const columns = useMemo<ColumnDef<Tenant>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("backoffice.tenants.columns.name")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
        size: 250,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.tenants.columns.name"),
          skeleton: <Skeleton className="h-4 w-40" />,
        },
      },
      {
        accessorKey: "slug",
        id: "slug",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("backoffice.tenants.columns.slug")} column={column} />
        ),
        cell: ({ row }) => (
          <code className="text-sm text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {row.original.slug}
          </code>
        ),
        size: 180,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.tenants.columns.slug"),
          skeleton: <Skeleton className="h-5 w-28" />,
        },
      },
      {
        accessorKey: "usersCount",
        id: "usersCount",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("backoffice.tenants.columns.usersCount")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.usersCount ?? 0}
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerTitle: t("backoffice.tenants.columns.usersCount"),
          skeleton: <Skeleton className="h-4 w-12" />,
        },
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("backoffice.tenants.columns.createdAt")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
        size: 140,
        enableSorting: true,
        meta: {
          headerTitle: t("backoffice.tenants.columns.createdAt"),
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
              <DropdownMenuItem onClick={() => setEditTenant(row.original)}>
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteTenant(row.original)}
              >
                {t("common.delete")}
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

  const sorting: SortingState = sortState
    ? [{ id: sortState.field, desc: sortState.order === "desc" }]
    : [];

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length === 0) {
      setSort(undefined);
    } else {
      setSort({
        field: newSorting[0].id,
        order: newSorting[0].desc ? "desc" : "asc",
      });
    }
  };

  const tenants = data?.tenants ?? [];
  const pagination = data?.pagination;
  const recordCount = pagination?.total ?? 0;
  const pageCount = pagination?.totalPages ?? 0;

  const table = useReactTable({
    columns,
    data: tenants,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: {
        pageIndex: params.page - 1,
        pageSize: params.limit,
      },
      sorting,
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex: params.page - 1, pageSize: params.limit })
          : updater;
      if (newPagination.pageSize !== params.limit) {
        setLimit(newPagination.pageSize);
      } else if (newPagination.pageIndex !== params.page - 1) {
        setPage(newPagination.pageIndex + 1);
      }
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isLoading && tenants.length === 0 && !params.search) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("backoffice.tenants.title")}</h1>
          <p className="text-muted-foreground">{t("backoffice.tenants.description")}</p>
        </div>
        <DataTableEmpty
          title={t("backoffice.tenants.empty.title")}
          description={t("backoffice.tenants.empty.description")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("backoffice.tenants.title")}</h1>
        <p className="text-muted-foreground">{t("backoffice.tenants.description")}</p>
      </div>

      <DataGrid table={table} recordCount={recordCount} isLoading={isLoading}>
        <Card>
          <CardHeader className="py-4">
            <CardHeading className="flex-1">
              <DataTableToolbar
                searchValue={params.search}
                onSearchChange={setSearch}
              />
            </CardHeading>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      <EditTenantDialog
        tenant={editTenant}
        open={!!editTenant}
        onOpenChange={(open) => !open && setEditTenant(null)}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTenant}
        onOpenChange={(open) => !open && setDeleteTenant(null)}
        title={t("backoffice.tenants.delete.title")}
        description={t("backoffice.tenants.delete.description", {
          name: deleteTenant?.name,
        })}
        confirmValue={deleteTenant?.name ?? ""}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
