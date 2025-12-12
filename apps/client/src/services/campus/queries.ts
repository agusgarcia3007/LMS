import { useQuery } from "@tanstack/react-query";
import {
  campusTenantOptions,
  campusCoursesOptions,
  campusCourseOptions,
  campusCategoriesOptions,
  campusStatsOptions,
  campusModuleItemsOptions,
} from "./options";
import type { CoursesListParams } from "./service";
import { useTenantInfo } from "@/hooks/use-tenant-info";

export const useCampusTenant = () => {
  const { isResolving } = useTenantInfo();
  return useQuery({
    ...campusTenantOptions(),
    enabled: !isResolving,
  });
};

export const useCampusCourses = (
  params: CoursesListParams = {},
  options?: { enabled?: boolean }
) => {
  const { isResolving } = useTenantInfo();
  const enabledFromOptions = options?.enabled ?? true;
  return useQuery({
    ...campusCoursesOptions(params),
    enabled: !isResolving && enabledFromOptions,
  });
};

export const useCampusCourse = (slug: string) => {
  const { isResolving } = useTenantInfo();
  return useQuery({
    ...campusCourseOptions(slug),
    enabled: !isResolving && !!slug,
  });
};

export const useCampusCategories = () => {
  const { isResolving } = useTenantInfo();
  return useQuery({
    ...campusCategoriesOptions(),
    enabled: !isResolving,
  });
};

export const useCampusStats = () => {
  const { isResolving } = useTenantInfo();
  return useQuery({
    ...campusStatsOptions(),
    enabled: !isResolving,
  });
};

export const useCampusModuleItems = (moduleId: string | null) => {
  const { isResolving } = useTenantInfo();
  return useQuery({
    ...campusModuleItemsOptions(moduleId!),
    enabled: !isResolving && !!moduleId,
  });
};
