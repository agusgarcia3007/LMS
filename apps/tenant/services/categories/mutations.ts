"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CategoriesService, QUERY_KEYS, type CreateCategoryRequest, type UpdateCategoryRequest } from "./service";
import { catchAxiosError } from "@/lib/http";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => CategoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      toast.success(t("categories.create.success"));
    },
    onError: (error) => catchAxiosError(error, t),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateCategoryRequest & { id: string }) =>
      CategoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      toast.success(t("categories.edit.success"));
    },
    onError: (error) => catchAxiosError(error, t),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => CategoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      toast.success(t("categories.delete.success"));
    },
    onError: (error) => catchAxiosError(error, t),
  });
}
