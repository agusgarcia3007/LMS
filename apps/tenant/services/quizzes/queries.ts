import { useQuery } from "@tanstack/react-query";
import { QuizzesService, QUERY_KEYS, type QuizListParams } from "./service";

export function useQuizzes(params: QuizListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZZES_LIST(params),
    queryFn: () => QuizzesService.list(params),
  });
}
