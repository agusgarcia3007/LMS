import { http } from "@/lib/http";

export type VideoStatus = "draft" | "published";

export type Video = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  videoKey: string | null;
  videoUrl: string | null;
  duration: number;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
};

export type VideoListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
};

export type VideoListResponse = {
  videos: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateVideoRequest = {
  title: string;
  description?: string;
  videoKey?: string;
  duration?: number;
  fileSizeBytes?: number;
  status?: VideoStatus;
};

export type UpdateVideoRequest = {
  id: string;
  title?: string;
  description?: string | null;
  status?: VideoStatus;
};

export const QUERY_KEYS = {
  VIDEOS: ["videos"],
  VIDEOS_LIST: (params: VideoListParams) => ["videos", "list", params],
  VIDEO: (id: string) => ["videos", id],
} as const;

export const VideosService = {
  async list(params: VideoListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `/videos?${queryString}` : "/videos";
    const { data } = await http.get<VideoListResponse>(url);
    return data;
  },

  async create(payload: CreateVideoRequest) {
    const { data } = await http.post<{ video: Video }>("/videos", payload);
    return data;
  },

  async update(id: string, payload: Omit<UpdateVideoRequest, "id">) {
    const { data } = await http.put<{ video: Video }>(`/videos/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/videos/${id}`);
    return data;
  },
} as const;
