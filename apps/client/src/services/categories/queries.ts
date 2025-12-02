import { useQuery } from "@tanstack/react-query";
import { categoriesListOptions, categoryOptions } from "./options";
import type { CategoryListParams } from "./service";

export const useGetCategories = (
  params: CategoryListParams = {},
  options?: { enabled?: boolean }
) => useQuery({ ...categoriesListOptions(params), ...options });

export const useGetCategory = (
  id: string,
  options?: { enabled?: boolean }
) => useQuery({ ...categoryOptions(id), ...options });
