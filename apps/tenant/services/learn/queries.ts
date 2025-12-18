"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LearnService, QUERY_KEYS } from "./service";

export function useCourseStructure(courseSlug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSE_STRUCTURE(courseSlug),
    queryFn: () => LearnService.getCourseStructure(courseSlug),
    enabled: !!courseSlug,
  });
}

export function useCourseProgress(courseSlug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSE_PROGRESS(courseSlug),
    queryFn: () => LearnService.getCourseProgress(courseSlug),
    enabled: !!courseSlug,
  });
}

export function useModuleItems(moduleId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.MODULE_ITEMS(moduleId),
    queryFn: () => LearnService.getModuleItems(moduleId),
    enabled: !!moduleId,
  });
}

export function useItemContent(itemId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ITEM_CONTENT(itemId),
    queryFn: () => LearnService.getItemContent(itemId),
    enabled: !!itemId,
  });
}

export function useCompleteItem(courseSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => LearnService.completeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSE_STRUCTURE(courseSlug) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSE_PROGRESS(courseSlug) });
    },
  });
}
