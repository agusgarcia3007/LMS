"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoriesService, QUERY_KEYS, type CategoryListParams } from "./service";

export function useCategories(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES_LIST(params),
    queryFn: () => CategoriesService.list(params),
  });
}
