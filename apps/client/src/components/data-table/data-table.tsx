import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";

import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterI18nConfig,
} from "@/components/ui/filters";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableEmpty } from "./data-table-empty";
import type { useDataTableState } from "@/hooks/use-data-table-state";

type PaginationInfo = {
  total: number;
  totalPages: number;
} | null;

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  tableState: ReturnType<typeof useDataTableState>;
  filterFields?: FilterFieldConfig[];
  emptyState?: {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
  };
  toolbarActions?: ReactNode;
  searchPlaceholder?: string;
}

export function DataTable<TData>({
  data,
  columns,
  pagination,
  isLoading = false,
  tableState,
  filterFields,
  emptyState,
  toolbarActions,
  searchPlaceholder,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const { params, sortState, setPage, setLimit, setSort, setSearch, setFilters } = tableState;

  const pageCount = pagination?.totalPages ?? 0;
  const recordCount = pagination?.total ?? 0;

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

  const table = useReactTable({
    columns,
    data,
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

  const filtersI18n: Partial<FilterI18nConfig> = {
    addFilter: t("filters.addFilter"),
    searchFields: t("filters.searchFields"),
    noFieldsFound: t("filters.noFieldsFound"),
    noResultsFound: t("filters.noResultsFound"),
    select: t("filters.select"),
    true: t("filters.true"),
    false: t("filters.false"),
    min: t("filters.min"),
    max: t("filters.max"),
    to: t("filters.to"),
    selected: t("filters.selected"),
    selectedCount: t("filters.selected"),
    operators: {
      is: t("filters.operators.is"),
      isNot: t("filters.operators.isNot"),
      isAnyOf: t("filters.operators.isAnyOf"),
      isNotAnyOf: t("filters.operators.isNotAnyOf"),
      includesAll: t("filters.operators.includesAll"),
      excludesAll: t("filters.operators.excludesAll"),
      before: t("filters.operators.before"),
      after: t("filters.operators.after"),
      between: t("filters.operators.between"),
      notBetween: t("filters.operators.notBetween"),
      contains: t("filters.operators.contains"),
      notContains: t("filters.operators.notContains"),
      startsWith: t("filters.operators.startsWith"),
      endsWith: t("filters.operators.endsWith"),
      isExactly: t("filters.operators.isExactly"),
      equals: t("filters.operators.equals"),
      notEquals: t("filters.operators.notEquals"),
      greaterThan: t("filters.operators.greaterThan"),
      lessThan: t("filters.operators.lessThan"),
      overlaps: t("filters.operators.overlaps"),
      includes: t("filters.operators.includes"),
      excludes: t("filters.operators.excludes"),
      includesAllOf: t("filters.operators.includesAllOf"),
      includesAnyOf: t("filters.operators.includesAnyOf"),
      empty: t("filters.operators.empty"),
      notEmpty: t("filters.operators.notEmpty"),
    },
    placeholders: {
      enterField: (fieldType: string) => t("filters.placeholders.enterField", { fieldType }),
      selectField: t("filters.placeholders.selectField"),
      searchField: (fieldName: string) => t("filters.placeholders.searchField", { fieldName }),
      enterKey: t("filters.placeholders.enterKey"),
      enterValue: t("filters.placeholders.enterValue"),
    },
    helpers: {
      formatOperator: (operator: string) => operator.replace(/_/g, " "),
    },
    validation: {
      invalidEmail: t("filters.validation.invalidEmail"),
      invalidUrl: t("filters.validation.invalidUrl"),
      invalidTel: t("filters.validation.invalidTel"),
      invalid: t("filters.validation.invalid"),
    },
  };

  const getDefaultOperator = (fieldType: string | undefined): string => {
    switch (fieldType) {
      case "multiselect":
      case "select":
        return "is";
      case "daterange":
        return "between";
      case "text":
        return "contains";
      default:
        return "is";
    }
  };

  const urlFiltersToFilters = (): Filter[] => {
    if (!filterFields) return [];

    const filters: Filter[] = [];
    for (const field of filterFields) {
      if (!field.key) continue;
      const value = params[field.key];
      if (value && typeof value === "string") {
        const colonIndex = value.indexOf(":");
        let operator: string;
        let rawValues: string;

        if (colonIndex > 0) {
          operator = value.substring(0, colonIndex);
          rawValues = value.substring(colonIndex + 1);
        } else {
          operator = field.defaultOperator ?? getDefaultOperator(field.type);
          rawValues = value;
        }

        if (rawValues) {
          filters.push({
            id: `${field.key}-filter`,
            field: field.key,
            operator,
            values: rawValues.split(","),
          });
        }
      }
    }
    return filters;
  };

  const handleFiltersChange = (newFilters: Filter[]) => {
    const filterParams: Record<string, string | undefined> = {};

    if (filterFields) {
      for (const field of filterFields) {
        if (field.key) {
          filterParams[field.key] = undefined;
        }
      }
    }

    for (const filter of newFilters) {
      const nonEmptyValues = filter.values.filter((v) => v !== "");
      if (nonEmptyValues.length > 0) {
        filterParams[filter.field] = `${filter.operator}:${nonEmptyValues.join(",")}`;
      }
    }

    setFilters(filterParams);
  };

  const activeFilters = urlFiltersToFilters();

  if (!isLoading && data.length === 0 && !params.search && activeFilters.length === 0 && emptyState) {
    return (
      <DataTableEmpty
        title={emptyState.title}
        description={emptyState.description}
        icon={emptyState.icon}
        action={emptyState.action}
      />
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DataGrid table={table as any} recordCount={recordCount} isLoading={isLoading}>
      <Card>
        <CardHeader className="py-4">
          <CardHeading className="flex-1">
            <DataTableToolbar
              searchValue={params.search}
              onSearchChange={setSearch}
              searchPlaceholder={searchPlaceholder}
              actions={toolbarActions}
            >
              {filterFields && filterFields.length > 0 && (
                <Filters
                  filters={activeFilters}
                  fields={filterFields}
                  onChange={handleFiltersChange}
                  i18n={filtersI18n}
                  size="sm"
                />
              )}
            </DataTableToolbar>
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
  );
}
