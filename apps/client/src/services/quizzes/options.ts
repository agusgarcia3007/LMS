import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import {
  QuizzesService,
  QUERY_KEYS,
  type CreateQuestionRequest,
  type UpdateQuestionRequest,
  type CreateOptionRequest,
  type UpdateOptionRequest,
} from "./service";

export const quizQuestionsOptions = (lessonId: string) =>
  queryOptions({
    queryFn: () => QuizzesService.getQuestions(lessonId),
    queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
    enabled: !!lessonId,
  });

export const createQuestionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      lessonId,
      ...payload
    }: { lessonId: string } & CreateQuestionRequest) =>
      QuizzesService.createQuestion(lessonId, payload),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
      toast.success(i18n.t("quizzes.question.createSuccess"));
    },
  });
};

export const updateQuestionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      questionId,
      lessonId,
      ...payload
    }: { questionId: string; lessonId: string } & UpdateQuestionRequest) =>
      QuizzesService.updateQuestion(questionId, payload),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
      toast.success(i18n.t("quizzes.question.updateSuccess"));
    },
  });
};

export const deleteQuestionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      questionId,
      lessonId,
    }: {
      questionId: string;
      lessonId: string;
    }) => QuizzesService.deleteQuestion(questionId),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
      toast.success(i18n.t("quizzes.question.deleteSuccess"));
    },
  });
};

export const reorderQuestionsOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      lessonId,
      questionIds,
    }: {
      lessonId: string;
      questionIds: string[];
    }) => QuizzesService.reorderQuestions(lessonId, questionIds),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
    },
  });
};

export const createOptionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      questionId,
      lessonId,
      ...payload
    }: { questionId: string; lessonId: string } & CreateOptionRequest) =>
      QuizzesService.createOption(questionId, payload),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
    },
  });
};

export const updateOptionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      optionId,
      lessonId,
      ...payload
    }: { optionId: string; lessonId: string } & UpdateOptionRequest) =>
      QuizzesService.updateOption(optionId, payload),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
    },
  });
};

export const deleteOptionOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({ optionId, lessonId }: { optionId: string; lessonId: string }) =>
      QuizzesService.deleteOption(optionId),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_QUESTIONS(lessonId),
      });
    },
  });
};
