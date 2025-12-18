import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { VideosService, QUERY_KEYS, type CreateVideoRequest, type UpdateVideoRequest } from "./service";

export function useCreateVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateVideoRequest) => VideosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      toast.success(t("videos.create.success"));
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateVideoRequest) => VideosService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      toast.success(t("videos.edit.success"));
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => VideosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      toast.success(t("videos.delete.success"));
    },
  });
}
