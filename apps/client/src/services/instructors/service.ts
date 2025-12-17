import { http } from "@/lib/http";
import type { PaginationResult } from "@/types/pagination";

export type SocialLinks = {
  twitter?: string;
  linkedin?: string;
  github?: string;
};

export type Instructor = {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  title: string | null;
  email: string | null;
  website: string | null;
  socialLinks: SocialLinks | null;
  order: number;
  isOwner: boolean;
  coursesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type InstructorListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  createdAt?: string;
};

export type InstructorListResponse = {
  instructors: Instructor[];
  pagination: PaginationResult;
};

export type InviteInstructorRequest = {
  email: string;
  name: string;
  title?: string;
};

export type UpdateInstructorRequest = {
  bio?: string | null;
  title?: string | null;
  email?: string | null;
  website?: string | null;
  socialLinks?: SocialLinks | null;
  order?: number;
};

export type ExistingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  hasInstructorProfile: boolean;
};

export type InviteInstructorResponse =
  | { userExists: false; instructor: Instructor }
  | { userExists: true; existingUser: ExistingUser };

export type PromoteInstructorRequest = {
  userId: string;
  title?: string;
};

export const QUERY_KEYS = {
  INSTRUCTORS: ["instructors"],
  INSTRUCTORS_LIST: (params: InstructorListParams) => [
    "instructors",
    "list",
    params,
  ],
  INSTRUCTOR: (id: string) => ["instructors", id],
} as const;

export const InstructorsService = {
  async list(params: InstructorListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.createdAt) searchParams.set("createdAt", params.createdAt);

    const queryString = searchParams.toString();
    const url = queryString ? `/instructors?${queryString}` : "/instructors";
    const { data } = await http.get<InstructorListResponse>(url);
    return data;
  },

  async getById(id: string) {
    const { data } = await http.get<{ instructor: Instructor }>(
      `/instructors/${id}`
    );
    return data;
  },

  async invite(payload: InviteInstructorRequest) {
    const { data } = await http.post<InviteInstructorResponse>(
      "/instructors/invite",
      payload
    );
    return data;
  },

  async promote(payload: PromoteInstructorRequest) {
    const { data } = await http.post<{ instructor: Instructor }>(
      `/instructors/promote/${payload.userId}`,
      { title: payload.title }
    );
    return data;
  },

  async update(id: string, payload: UpdateInstructorRequest) {
    const { data } = await http.put<{ instructor: Instructor }>(
      `/instructors/${id}`,
      payload
    );
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(
      `/instructors/${id}`
    );
    return data;
  },
} as const;
