import { http } from "@/lib/http";

export type SubtitleStatus = "pending" | "processing" | "completed" | "failed";

export type Subtitle = {
  id: string;
  language: string;
  label: string;
  isOriginal: boolean;
  status: SubtitleStatus;
  errorMessage: string | null;
  createdAt: string;
};

export const QUERY_KEYS = {
  SUBTITLES: (videoId: string) => ["subtitles", videoId],
  SUBTITLE_VTT: (videoId: string, language: string) => [
    "subtitles",
    videoId,
    "vtt",
    language,
  ],
} as const;

export const SubtitlesService = {
  async list(videoId: string) {
    const { data } = await http.get<{ subtitles: Subtitle[] }>(
      `/ai/videos/${videoId}/subtitles`
    );
    return data;
  },

  async generate(videoId: string, sourceLanguage?: string) {
    const { data } = await http.post<{ subtitleId: string; status: string }>(
      `/ai/videos/${videoId}/subtitles/generate`,
      sourceLanguage ? { sourceLanguage } : undefined
    );
    return data;
  },

  async translate(videoId: string, targetLanguage: string) {
    const { data } = await http.post<{ subtitleId: string; status: string }>(
      `/ai/videos/${videoId}/subtitles/translate`,
      { targetLanguage }
    );
    return data;
  },

  async getVtt(subtitleId: string) {
    const { data } = await http.get<{ vttUrl?: string; vtt?: string }>(
      `/ai/subtitles/${subtitleId}/vtt`
    );
    return data;
  },

  async getVttByLanguage(videoId: string, language: string) {
    const { data } = await http.get<{ vttUrl: string }>(
      `/ai/videos/${videoId}/subtitles/${language}/vtt`
    );
    return data;
  },

  async delete(subtitleId: string) {
    const { data } = await http.delete<{ success: boolean }>(
      `/ai/subtitles/${subtitleId}`
    );
    return data;
  },
} as const;
