import { useQuery } from "@tanstack/react-query";
import { lessonsListOptions, lessonOptions } from "./options";
import type { LessonListParams } from "./service";

export const useGetLessons = (params: LessonListParams = {}) =>
  useQuery(lessonsListOptions(params));

export const useGetLesson = (id: string) => useQuery(lessonOptions(id));
