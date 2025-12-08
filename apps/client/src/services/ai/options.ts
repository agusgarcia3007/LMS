import { mutationOptions } from "@tanstack/react-query";
import { AIService } from "./service";

export const analyzeVideoOptions = () =>
  mutationOptions({
    mutationFn: (videoId: string) => AIService.analyzeVideo(videoId),
  });
