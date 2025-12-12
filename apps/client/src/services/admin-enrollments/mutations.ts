import { useMutation } from "@tanstack/react-query";
import {
  useCreateEnrollmentOptions,
  useBulkEnrollOptions,
  useUpdateEnrollmentStatusOptions,
} from "./options";

export const useCreateEnrollment = () =>
  useMutation(useCreateEnrollmentOptions());

export const useBulkEnroll = () => useMutation(useBulkEnrollOptions());

export const useUpdateEnrollmentStatus = () =>
  useMutation(useUpdateEnrollmentStatusOptions());
