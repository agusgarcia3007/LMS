import { useMutation } from "@tanstack/react-query";
import {
  createCourseOptions,
  updateCourseOptions,
  deleteCourseOptions,
  updateCourseModulesOptions,
  uploadThumbnailOptions,
  deleteThumbnailOptions,
  uploadVideoOptions,
  deleteVideoOptions,
} from "./options";

export const useCreateCourse = () => useMutation(createCourseOptions());

export const useUpdateCourse = () => useMutation(updateCourseOptions());

export const useDeleteCourse = () => useMutation(deleteCourseOptions());

export const useUpdateCourseModules = () => useMutation(updateCourseModulesOptions());

export const useUploadThumbnail = () => useMutation(uploadThumbnailOptions());

export const useDeleteThumbnail = () => useMutation(deleteThumbnailOptions());

export const useUploadVideo = () => useMutation(uploadVideoOptions());

export const useDeleteVideo = () => useMutation(deleteVideoOptions());
