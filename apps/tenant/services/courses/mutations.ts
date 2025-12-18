import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CoursesService, QUERY_KEYS, type CreateCourseRequest, type UpdateCourseRequest } from "./service";

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => CoursesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES });
      toast.success(t("courses.create.success"));
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) => CoursesService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES });
      toast.success(t("courses.edit.success"));
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => CoursesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES });
      toast.success(t("courses.delete.success"));
    },
  });
}
