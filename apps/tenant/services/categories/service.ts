import { http } from "@/lib/http";

export type Category = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  coursesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export type CategoryListResponse = {
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
};

export type CreateCategoryRequest = {
  name: string;
  slug?: string;
  description?: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  slug?: string;
  description?: string | null;
};

export const QUERY_KEYS = {
  CATEGORIES: ["categories"] as const,
  CATEGORIES_LIST: (params: CategoryListParams) => ["categories", "list", params] as const,
} as const;

export const CategoriesService = {
  async list(params: CategoryListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);

    const queryString = searchParams.toString();
    const url = queryString ? `/categories?${queryString}` : "/categories";
    const { data } = await http.get<CategoryListResponse>(url);
    return data;
  },

  async create(payload: CreateCategoryRequest) {
    const { data } = await http.post<{ category: Category }>("/categories", payload);
    return data;
  },

  async update(id: string, payload: UpdateCategoryRequest) {
    const { data } = await http.put<{ category: Category }>(`/categories/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/categories/${id}`);
    return data;
  },
} as const;
