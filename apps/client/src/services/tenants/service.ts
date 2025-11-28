import { http } from "@/lib/http";

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  usersCount?: number;
};

export type PaginationResult = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TenantListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  createdAt?: string;
};

export type TenantListResponse = {
  tenants: Tenant[];
  pagination: PaginationResult | null;
};

export type CreateTenantRequest = {
  slug: string;
  name: string;
};

export type UpdateTenantRequest = {
  name: string;
};

export const QUERY_KEYS = {
  TENANTS: ["tenants"],
  TENANTS_LIST: (params: TenantListParams) => ["tenants", "list", params],
  TENANT: (slug: string) => ["tenants", slug],
} as const;

export const TenantsService = {
  async list(params: TenantListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.createdAt) searchParams.set("createdAt", params.createdAt);

    const queryString = searchParams.toString();
    const url = queryString ? `/tenants?${queryString}` : "/tenants";
    const { data } = await http.get<TenantListResponse>(url);
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await http.get<{ tenant: Tenant }>(`/tenants/${slug}`);
    return data;
  },

  async create(payload: CreateTenantRequest) {
    const { data } = await http.post<{ tenant: Tenant }>("/tenants", payload);
    return data;
  },

  async update(id: string, payload: UpdateTenantRequest) {
    const { data } = await http.put<{ tenant: Tenant }>(
      `/tenants/${id}`,
      payload
    );
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/tenants/${id}`);
    return data;
  },
} as const;
