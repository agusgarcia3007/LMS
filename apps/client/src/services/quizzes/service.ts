import { http } from "@/lib/http";

export type QuestionType = "multiple_choice" | "multiple_select" | "true_false";

export type Option = {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
};

export type Question = {
  id: string;
  lessonId: string;
  tenantId: string;
  type: QuestionType;
  questionText: string;
  explanation: string | null;
  order: number;
  options: Option[];
  createdAt: string;
  updatedAt: string;
};

export type CreateQuestionRequest = {
  type: QuestionType;
  questionText: string;
  explanation?: string;
  options?: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

export type UpdateQuestionRequest = {
  type?: QuestionType;
  questionText?: string;
  explanation?: string | null;
  order?: number;
};

export type CreateOptionRequest = {
  optionText: string;
  isCorrect: boolean;
};

export type UpdateOptionRequest = {
  optionText?: string;
  isCorrect?: boolean;
  order?: number;
};

export const QUERY_KEYS = {
  QUIZZES: ["quizzes"],
  QUIZ_QUESTIONS: (lessonId: string) => ["quizzes", "questions", lessonId],
} as const;

export const QuizzesService = {
  async getQuestions(lessonId: string) {
    const { data } = await http.get<{ questions: Question[] }>(
      `/quizzes/lessons/${lessonId}/questions`
    );
    return data;
  },

  async createQuestion(lessonId: string, payload: CreateQuestionRequest) {
    const { data } = await http.post<{ question: Question }>(
      `/quizzes/lessons/${lessonId}/questions`,
      payload
    );
    return data;
  },

  async updateQuestion(questionId: string, payload: UpdateQuestionRequest) {
    const { data } = await http.put<{ question: Question }>(
      `/quizzes/questions/${questionId}`,
      payload
    );
    return data;
  },

  async deleteQuestion(questionId: string) {
    const { data } = await http.delete<{ success: boolean }>(
      `/quizzes/questions/${questionId}`
    );
    return data;
  },

  async reorderQuestions(lessonId: string, questionIds: string[]) {
    const { data } = await http.put<{ success: boolean }>(
      `/quizzes/lessons/${lessonId}/questions/reorder`,
      { questionIds }
    );
    return data;
  },

  async createOption(questionId: string, payload: CreateOptionRequest) {
    const { data } = await http.post<{ option: Option }>(
      `/quizzes/questions/${questionId}/options`,
      payload
    );
    return data;
  },

  async updateOption(optionId: string, payload: UpdateOptionRequest) {
    const { data } = await http.put<{ option: Option }>(
      `/quizzes/options/${optionId}`,
      payload
    );
    return data;
  },

  async deleteOption(optionId: string) {
    const { data } = await http.delete<{ success: boolean }>(
      `/quizzes/options/${optionId}`
    );
    return data;
  },
} as const;
