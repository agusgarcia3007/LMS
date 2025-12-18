"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckoutService, QUERY_KEYS } from "./service";

export function useSessionStatus(sessionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SESSION_STATUS(sessionId),
    queryFn: () => CheckoutService.getSessionStatus(sessionId),
    enabled: !!sessionId,
  });
}

export function useEnrollmentStatus(sessionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ENROLLMENT_STATUS(sessionId),
    queryFn: () => CheckoutService.getEnrollmentStatus(sessionId),
    enabled: !!sessionId,
  });
}
