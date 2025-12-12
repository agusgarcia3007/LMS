import { useQuery } from "@tanstack/react-query";
import {
  adminEnrollmentsListOptions,
  adminEnrollmentOptions,
} from "./options";
import type { AdminEnrollmentListParams } from "./service";

export const useAdminEnrollments = (params: AdminEnrollmentListParams = {}) =>
  useQuery(adminEnrollmentsListOptions(params));

export const useAdminEnrollment = (id: string) =>
  useQuery(adminEnrollmentOptions(id));
