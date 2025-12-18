import { useQuery } from "@tanstack/react-query";
import { VideosService, QUERY_KEYS, type VideoListParams } from "./service";

export function useVideos(params: VideoListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.VIDEOS_LIST(params),
    queryFn: () => VideosService.list(params),
  });
}
