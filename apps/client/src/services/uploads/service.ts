import { http } from "@/lib/http";

export type UploadFolder =
  | "avatars"
  | "videos"
  | "courses"
  | "courses/videos"
  | "documents"
  | "chat-images"
  | "learn-chat-images"
  | "onboarding-temp";

export type PresignRequest = {
  folder: UploadFolder;
  fileName: string;
  contentType: string;
};

export type PresignResponse = {
  uploadUrl: string;
  key: string;
};

export const UploadsService = {
  async getPresignedUrl(request: PresignRequest): Promise<PresignResponse> {
    const { data } = await http.post<PresignResponse>("/uploads/presign", request);
    return data;
  },
};
