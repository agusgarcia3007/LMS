import { useQuery } from "@tanstack/react-query";
import {
  campusTenantOptions,
  campusCoursesOptions,
  campusCourseOptions,
  campusCategoriesOptions,
  campusStatsOptions,
} from "./options";
import type { CoursesListParams } from "./service";

export const useCampusTenant = () => useQuery(campusTenantOptions());

export const useCampusCourses = (params: CoursesListParams = {}) =>
  useQuery(campusCoursesOptions(params));

export const useCampusCourse = (slug: string) =>
  useQuery(campusCourseOptions(slug));

export const useCampusCategories = () => useQuery(campusCategoriesOptions());

export const useCampusStats = () => useQuery(campusStatsOptions());
