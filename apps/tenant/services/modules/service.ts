import { http } from "@/lib/http";

export type ModuleStatus = "draft" | "published";

export type Module = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  status: ModuleStatus;
  order: number;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ModuleListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
};

export type ModuleListResponse = {
  modules: Module[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateModuleRequest = {
  title: string;
  description?: string;
  status?: ModuleStatus;
};

export type UpdateModuleRequest = {
  id: string;
  title?: string;
  description?: string | null;
  status?: ModuleStatus;
};

export const QUERY_KEYS = {
  MODULES: ["modules"],
  MODULES_LIST: (params: ModuleListParams) => ["modules", "list", params],
  MODULE: (id: string) => ["modules", id],
} as const;

export const ModulesService = {
  async list(params: ModuleListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `/modules?${queryString}` : "/modules";
    const { data } = await http.get<ModuleListResponse>(url);
    return data;
  },

  async create(payload: CreateModuleRequest) {
    const { data } = await http.post<{ module: Module }>("/modules", payload);
    return data;
  },

  async update(id: string, payload: Omit<UpdateModuleRequest, "id">) {
    const { data } = await http.put<{ module: Module }>(`/modules/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/modules/${id}`);
    return data;
  },
} as const;
