"use client";

import { useQuery } from "@tanstack/react-query";
import { CampusService, QUERY_KEYS } from "./service";

type CourseFilters = {
  search?: string;
  category?: string;
  level?: string;
};

export function useCampusCourses(
  filters: CourseFilters,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COURSES, filters],
    queryFn: () =>
      CampusService.listCourses({
        limit: 100,
        search: filters.search,
        category: filters.category,
        level: filters.level,
      }),
    enabled: options.enabled ?? true,
  });
}

export function useCampusCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => CampusService.getCategories(),
  });
}
