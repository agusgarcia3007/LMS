import { useMutation } from "@tanstack/react-query";
import {
  useInviteInstructorOptions,
  usePromoteInstructorOptions,
  useUpdateInstructorOptions,
  useDeleteInstructorOptions,
} from "./options";

export const useInviteInstructor = () =>
  useMutation(useInviteInstructorOptions());

export const usePromoteInstructor = () =>
  useMutation(usePromoteInstructorOptions());

export const useUpdateInstructor = () =>
  useMutation(useUpdateInstructorOptions());

export const useDeleteInstructor = () =>
  useMutation(useDeleteInstructorOptions());
