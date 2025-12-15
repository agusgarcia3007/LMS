import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubtitlesService, QUERY_KEYS } from "./service";

export function useGenerateSubtitles(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceLanguage?: string) =>
      SubtitlesService.generate(videoId, sourceLanguage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_SUBTITLES(videoId) });
    },
  });
}

export function useTranslateSubtitles(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetLanguage: string) =>
      SubtitlesService.translate(videoId, targetLanguage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_SUBTITLES(videoId) });
    },
  });
}

export function useDeleteSubtitle(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtitleId: string) => SubtitlesService.delete(subtitleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_SUBTITLES(videoId) });
    },
  });
}
