import { useMutation } from "@tanstack/react-query";
import {
  useInviteInstructorOptions,
  useUpdateInstructorOptions,
  useDeleteInstructorOptions,
} from "./options";

export const useInviteInstructor = () =>
  useMutation(useInviteInstructorOptions());

export const useUpdateInstructor = () =>
  useMutation(useUpdateInstructorOptions());

export const useDeleteInstructor = () =>
  useMutation(useDeleteInstructorOptions());
