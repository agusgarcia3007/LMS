import { useQuery } from "@tanstack/react-query";
import { CoursesService, QUERY_KEYS, type CourseListParams } from "./service";

export function useCourses(params: CourseListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES_LIST(params),
    queryFn: () => CoursesService.list(params),
  });
}
