import { useQuery } from "@tanstack/react-query";
import {
  courseStructureOptions,
  courseProgressOptions,
  moduleItemsOptions,
  itemContentOptions,
  relatedCoursesOptions,
} from "./options";

export const useCourseStructure = (courseSlug: string) =>
  useQuery(courseStructureOptions(courseSlug));

export const useCourseProgress = (courseSlug: string) =>
  useQuery(courseProgressOptions(courseSlug));

export const useModuleItems = (moduleId: string | null) =>
  useQuery({
    ...moduleItemsOptions(moduleId!),
    enabled: !!moduleId,
  });

export const useItemContent = (moduleItemId: string) =>
  useQuery(itemContentOptions(moduleItemId));

export const useRelatedCourses = (courseSlug: string) =>
  useQuery(relatedCoursesOptions(courseSlug));
