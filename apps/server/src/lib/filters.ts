import {
  SQL,
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  like,
  lte,
  or,
  sql,
  type AnyColumn,
} from "drizzle-orm";
import type { PgSelect, PgTable } from "drizzle-orm/pg-core";

export type SortOrder = "asc" | "desc";

export type SortParams = {
  field: string;
  order: SortOrder;
};

export type PaginationResult = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListParams = {
  page: number;
  limit: number;
  sort?: SortParams;
  search?: string;
  filters: Record<string, string | undefined>;
};

export type FieldMap<T extends PgTable> = {
  [key: string]: AnyColumn;
};

export type SearchableFields<T extends PgTable> = AnyColumn[];

export function parseListParams(query: Record<string, string | undefined>): ListParams {
  const page = Math.max(1, parseInt(query.page ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "10", 10)));

  let sort: SortParams | undefined;
  if (query.sort) {
    const [field, order] = query.sort.split(":");
    if (field && (order === "asc" || order === "desc")) {
      sort = { field, order };
    }
  }

  const reservedKeys = ["page", "limit", "sort", "search"];
  const filters: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!reservedKeys.includes(key) && value !== undefined && value !== "") {
      filters[key] = value;
    }
  }

  return {
    page,
    limit,
    sort,
    search: query.search,
    filters,
  };
}

export function buildSearchCondition<T extends PgTable>(
  searchValue: string,
  searchableFields: SearchableFields<T>
): SQL | undefined {
  if (!searchValue || searchableFields.length === 0) {
    return undefined;
  }

  const searchPattern = `%${searchValue}%`;
  const conditions = searchableFields.map((field) => ilike(field, searchPattern));

  return conditions.length === 1 ? conditions[0] : or(...conditions);
}

export function buildFilterConditions<T extends PgTable>(
  filters: Record<string, string | undefined>,
  fieldMap: FieldMap<T>
): SQL[] {
  const conditions: SQL[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "") continue;

    const column = fieldMap[key];
    if (!column) continue;

    if (value.includes(":")) {
      const [start, end] = value.split(":");
      if (start && end) {
        conditions.push(gte(column, start));
        conditions.push(lte(column, end));
      } else if (start) {
        conditions.push(gte(column, start));
      } else if (end) {
        conditions.push(lte(column, end));
      }
    } else if (value.includes(",")) {
      const values = value.split(",").filter(Boolean);
      if (values.length > 0) {
        conditions.push(inArray(column, values));
      }
    } else {
      conditions.push(eq(column, value));
    }
  }

  return conditions;
}

export function buildWhereClause<T extends PgTable>(
  params: ListParams,
  fieldMap: FieldMap<T>,
  searchableFields: SearchableFields<T>
): SQL | undefined {
  const conditions: SQL[] = [];

  if (params.search) {
    const searchCondition = buildSearchCondition(params.search, searchableFields);
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const filterConditions = buildFilterConditions(params.filters, fieldMap);
  conditions.push(...filterConditions);

  if (conditions.length === 0) {
    return undefined;
  }

  return conditions.length === 1 ? conditions[0] : and(...conditions);
}

export function getSortColumn(
  sort: SortParams | undefined,
  fieldMap: FieldMap<PgTable>,
  defaultSort?: { field: string; order: SortOrder }
): SQL | undefined {
  const sortToApply = sort ?? defaultSort;
  if (!sortToApply) {
    return undefined;
  }

  const column = fieldMap[sortToApply.field];
  if (!column) {
    return undefined;
  }

  return sortToApply.order === "desc" ? desc(column) : asc(column);
}

export function getPaginationParams(page: number, limit: number) {
  return {
    limit,
    offset: (page - 1) * limit,
  };
}

export function calculatePagination(
  total: number,
  page: number,
  limit: number
): PaginationResult {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
