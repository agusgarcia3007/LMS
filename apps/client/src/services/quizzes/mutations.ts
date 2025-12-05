import { useMutation } from "@tanstack/react-query";
import {
  createQuestionOptions,
  updateQuestionOptions,
  deleteQuestionOptions,
  reorderQuestionsOptions,
  createOptionOptions,
  updateOptionOptions,
  deleteOptionOptions,
} from "./options";

export const useCreateQuestion = () => useMutation(createQuestionOptions());

export const useUpdateQuestion = () => useMutation(updateQuestionOptions());

export const useDeleteQuestion = () => useMutation(deleteQuestionOptions());

export const useReorderQuestions = () => useMutation(reorderQuestionsOptions());

export const useCreateOption = () => useMutation(createOptionOptions());

export const useUpdateOption = () => useMutation(updateOptionOptions());

export const useDeleteOption = () => useMutation(deleteOptionOptions());
