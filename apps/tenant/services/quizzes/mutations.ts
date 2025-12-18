import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { QuizzesService, QUERY_KEYS, type CreateQuizRequest, type UpdateQuizRequest } from "./service";

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateQuizRequest) => QuizzesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
      toast.success(t("quizzes.create.success"));
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateQuizRequest) => QuizzesService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
      toast.success(t("quizzes.edit.success"));
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => QuizzesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES });
      toast.success(t("quizzes.delete.success"));
    },
  });
}
