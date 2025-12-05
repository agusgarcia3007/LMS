import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import {
  LessonsService,
  QUERY_KEYS,
  type LessonListParams,
  type CreateLessonRequest,
  type UpdateLessonRequest,
  type UploadVideoRequest,
  type UploadFileRequest,
} from "./service";

export const lessonsListOptions = (params: LessonListParams = {}) =>
  queryOptions({
    queryFn: () => LessonsService.list(params),
    queryKey: QUERY_KEYS.LESSONS_LIST(params),
  });

export const lessonOptions = (id: string) =>
  queryOptions({
    queryFn: () => LessonsService.getById(id),
    queryKey: QUERY_KEYS.LESSON(id),
    enabled: !!id,
  });

export const createLessonOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: CreateLessonRequest) => LessonsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      toast.success(i18n.t("lessons.create.success"));
    },
  });
};

export const updateLessonOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateLessonRequest) =>
      LessonsService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(id) });
      toast.success(i18n.t("lessons.edit.success"));
    },
  });
};

export const deleteLessonOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: LessonsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      toast.success(i18n.t("lessons.delete.success"));
    },
  });
};

export const uploadVideoOptions = () => {
  return mutationOptions({
    mutationFn: (video: string) => LessonsService.upload(video),
  });
};

export const uploadLessonVideoOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({ id, ...payload }: { id: string } & UploadVideoRequest) =>
      LessonsService.uploadVideo(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(id) });
      toast.success(i18n.t("lessons.video.uploadSuccess"));
    },
  });
};

export const deleteLessonVideoOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: LessonsService.deleteVideo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(data.lesson.id) });
      toast.success(i18n.t("lessons.video.deleteSuccess"));
    },
  });
};

export const uploadLessonFileOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({ id, ...payload }: { id: string } & UploadFileRequest) =>
      LessonsService.uploadFile(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(id) });
      toast.success(i18n.t("lessons.file.uploadSuccess"));
    },
  });
};

export const deleteLessonFileOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: LessonsService.deleteFile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON(data.lesson.id) });
      toast.success(i18n.t("lessons.file.deleteSuccess"));
    },
  });
};
