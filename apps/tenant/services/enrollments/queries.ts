"use client";

import { useQuery } from "@tanstack/react-query";
import { EnrollmentsService, QUERY_KEYS } from "./service";

export function useEnrollments() {
  return useQuery({
    queryKey: QUERY_KEYS.ENROLLMENTS,
    queryFn: () => EnrollmentsService.list(),
  });
}

export function useEnrollmentCheck(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ENROLLMENT(courseId),
    queryFn: () => EnrollmentsService.check(courseId),
    enabled: !!courseId,
  });
}
