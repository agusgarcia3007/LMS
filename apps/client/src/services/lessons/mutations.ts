import { useMutation } from "@tanstack/react-query";
import {
  createLessonOptions,
  updateLessonOptions,
  deleteLessonOptions,
  uploadVideoOptions,
  uploadLessonVideoOptions,
  deleteLessonVideoOptions,
} from "./options";

export const useCreateLesson = () => useMutation(createLessonOptions());

export const useUpdateLesson = () => useMutation(updateLessonOptions());

export const useDeleteLesson = () => useMutation(deleteLessonOptions());

export const useUploadVideo = () => useMutation(uploadVideoOptions());

export const useUploadLessonVideo = () => useMutation(uploadLessonVideoOptions());

export const useDeleteLessonVideo = () => useMutation(deleteLessonVideoOptions());
