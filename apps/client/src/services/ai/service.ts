import { http } from "@/lib/http";

export type AnalyzeVideoResponse = {
  title: string;
  description: string;
};

export const QUERY_KEYS = {
  AI: ["ai"],
} as const;

export const AIService = {
  async analyzeVideo(videoId: string) {
    const { data } = await http.post<AnalyzeVideoResponse>(
      `/ai/videos/${videoId}/analyze`
    );
    return data;
  },
} as const;
