import { useQuery } from "@tanstack/react-query";
import { coursesListOptions, courseOptions } from "./options";
import type { CourseListParams } from "./service";

export const useGetCourses = (
  params: CourseListParams = {},
  options?: { enabled?: boolean }
) => useQuery({ ...coursesListOptions(params), ...options });

export const useGetCourse = (
  id: string,
  options?: { enabled?: boolean }
) => useQuery({ ...courseOptions(id), ...options });
