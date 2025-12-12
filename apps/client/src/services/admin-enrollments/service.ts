import { http } from "@/lib/http";
import type { PaginationResult } from "@/types/pagination";

export type EnrollmentStatus = "active" | "completed" | "cancelled";

export type AdminEnrollmentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export type AdminEnrollmentCourse = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
};

export type AdminEnrollment = {
  id: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  user: AdminEnrollmentUser;
  course: AdminEnrollmentCourse;
};

export type AdminEnrollmentListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  courseId?: string;
  userId?: string;
  createdAt?: string;
};

export type AdminEnrollmentListResponse = {
  enrollments: AdminEnrollment[];
  pagination: PaginationResult;
};

export type ItemProgress = {
  id: string;
  status: "not_started" | "in_progress" | "completed";
  videoProgress: number | null;
  completedAt: string | null;
  item: {
    id: string;
    title: string;
    type: string;
  };
};

export type AdminEnrollmentDetail = AdminEnrollment & {
  itemsProgress: ItemProgress[];
};

export type CreateEnrollmentRequest = {
  userId: string;
  courseId: string;
};

export type BulkEnrollRequest = {
  userIds?: string[];
  courseIds?: string[];
  userId?: string;
  courseId?: string;
};

export type UpdateStatusRequest = {
  status: "active" | "cancelled";
};

export const QUERY_KEYS = {
  ADMIN_ENROLLMENTS: ["admin-enrollments"],
  ADMIN_ENROLLMENTS_LIST: (params: AdminEnrollmentListParams) =>
    ["admin-enrollments", "list", params],
  ADMIN_ENROLLMENT: (id: string) => ["admin-enrollments", id],
} as const;

export const AdminEnrollmentsService = {
  async list(params: AdminEnrollmentListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.courseId) searchParams.set("courseId", params.courseId);
    if (params.userId) searchParams.set("userId", params.userId);
    if (params.createdAt) searchParams.set("createdAt", params.createdAt);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/admin/enrollments?${queryString}`
      : "/admin/enrollments";
    const { data } = await http.get<AdminEnrollmentListResponse>(url);
    return data;
  },

  async getById(id: string) {
    const { data } = await http.get<{ enrollment: AdminEnrollmentDetail }>(
      `/admin/enrollments/${id}`
    );
    return data;
  },

  async create(payload: CreateEnrollmentRequest) {
    const { data } = await http.post<{ enrollment: AdminEnrollment }>(
      "/admin/enrollments",
      payload
    );
    return data;
  },

  async bulkCreate(payload: BulkEnrollRequest) {
    const { data } = await http.post<{ created: number }>(
      "/admin/enrollments/bulk",
      payload
    );
    return data;
  },

  async updateStatus(id: string, payload: UpdateStatusRequest) {
    const { data } = await http.patch<{ enrollment: AdminEnrollment }>(
      `/admin/enrollments/${id}/status`,
      payload
    );
    return data;
  },

  async exportCsv() {
    const response = await http.get("/admin/enrollments/export", {
      responseType: "blob",
    });
    return response.data as Blob;
  },
} as const;
