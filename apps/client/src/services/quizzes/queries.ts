import { useQuery } from "@tanstack/react-query";
import { quizQuestionsOptions } from "./options";

export const useQuizQuestions = (lessonId: string) =>
  useQuery(quizQuestionsOptions(lessonId));
