import { http } from "@/lib/http";

export type QuizStatus = "draft" | "published";

export type Quiz = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type QuizListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
};

export type QuizListResponse = {
  quizzes: Quiz[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateQuizRequest = {
  title: string;
  description?: string;
  status?: QuizStatus;
};

export type UpdateQuizRequest = {
  id: string;
  title?: string;
  description?: string | null;
  status?: QuizStatus;
};

export const QUERY_KEYS = {
  QUIZZES: ["quizzes"],
  QUIZZES_LIST: (params: QuizListParams) => ["quizzes", "list", params],
  QUIZ: (id: string) => ["quizzes", id],
} as const;

export const QuizzesService = {
  async list(params: QuizListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `/quizzes?${queryString}` : "/quizzes";
    const { data } = await http.get<QuizListResponse>(url);
    return data;
  },

  async create(payload: CreateQuizRequest) {
    const { data } = await http.post<{ quiz: Quiz }>("/quizzes", payload);
    return data;
  },

  async update(id: string, payload: Omit<UpdateQuizRequest, "id">) {
    const { data } = await http.put<{ quiz: Quiz }>(`/quizzes/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/quizzes/${id}`);
    return data;
  },
} as const;
