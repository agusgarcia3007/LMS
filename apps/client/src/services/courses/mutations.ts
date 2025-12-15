import { useMutation } from "@tanstack/react-query";
import {
  useCreateCourseOptions,
  useUpdateCourseOptions,
  useDeleteCourseOptions,
  useUpdateCourseModulesOptions,
  useConfirmThumbnailOptions,
  useDeleteThumbnailOptions,
  useConfirmCourseVideoOptions,
  useDeleteCourseVideoOptions,
} from "./options";

export const useCreateCourse = () => useMutation(useCreateCourseOptions());

export const useUpdateCourse = () => useMutation(useUpdateCourseOptions());

export const useDeleteCourse = () => useMutation(useDeleteCourseOptions());

export const useUpdateCourseModules = () => useMutation(useUpdateCourseModulesOptions());

export const useConfirmThumbnail = () => useMutation(useConfirmThumbnailOptions());

export const useDeleteThumbnail = () => useMutation(useDeleteThumbnailOptions());

export const useConfirmCourseVideo = () => useMutation(useConfirmCourseVideoOptions());

export const useDeleteCourseVideo = () => useMutation(useDeleteCourseVideoOptions());
