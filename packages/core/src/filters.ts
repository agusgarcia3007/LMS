export type SortOrder = "asc" | "desc";

export type SortParams = {
  field: string;
  order: SortOrder;
};

export type ListParams = {
  page: number;
  limit: number;
  sort?: SortParams;
  search?: string;
  filters: Record<string, string | undefined>;
};

export type FilterOperator = "is" | "is_not" | "contains" | "not_contains";
