import { http } from "@/lib/http";

export type DocumentStatus = "draft" | "published";

export type Document = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  fileKey: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  fileUrl: string | null;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
};

export type DocumentListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
};

export type DocumentListResponse = {
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateDocumentRequest = {
  title: string;
  description?: string;
  fileKey?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  status?: DocumentStatus;
};

export type UpdateDocumentRequest = {
  id: string;
  title?: string;
  description?: string | null;
  status?: DocumentStatus;
};

export const QUERY_KEYS = {
  DOCUMENTS: ["documents"],
  DOCUMENTS_LIST: (params: DocumentListParams) => ["documents", "list", params],
  DOCUMENT: (id: string) => ["documents", id],
} as const;

export const DocumentsService = {
  async list(params: DocumentListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `/documents?${queryString}` : "/documents";
    const { data } = await http.get<DocumentListResponse>(url);
    return data;
  },

  async create(payload: CreateDocumentRequest) {
    const { data } = await http.post<{ document: Document }>("/documents", payload);
    return data;
  },

  async update(id: string, payload: Omit<UpdateDocumentRequest, "id">) {
    const { data } = await http.put<{ document: Document }>(`/documents/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/documents/${id}`);
    return data;
  },
} as const;
