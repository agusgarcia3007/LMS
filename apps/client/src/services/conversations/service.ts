import { http } from "@/lib/http";
import type { PaginationResult } from "@/types/pagination";

export type ConversationType = "learn" | "creator";

export type ConversationMetadata = {
  courseId?: string;
  courseTitle?: string;
  itemId?: string;
  itemTitle?: string;
  contextCourseIds?: string[];
};

export type Conversation = {
  id: string;
  type: ConversationType;
  title: string | null;
  metadata: ConversationMetadata | null;
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<
    | { type: "image"; key: string }
    | { type: "file"; data: string; mimeType: string; fileName?: string }
  >;
  toolInvocations?: Array<{
    id: string;
    toolName: string;
    args: Record<string, unknown>;
    result?: unknown;
  }>;
  createdAt: string;
};

export type ConversationWithMessages = Conversation & {
  messages: ConversationMessage[];
};

export type ConversationListParams = {
  type?: ConversationType;
  page?: number;
  limit?: number;
};

export type CreateConversationRequest = {
  type: ConversationType;
  title?: string;
  metadata?: ConversationMetadata;
};

export type SaveMessagesRequest = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    attachments?: Array<
      | { type: "image"; key: string }
      | { type: "file"; data: string; mimeType: string; fileName?: string }
    >;
    toolInvocations?: Array<{
      id: string;
      toolName: string;
      args: Record<string, unknown>;
      result?: unknown;
    }>;
  }>;
};

export const QUERY_KEYS = {
  CONVERSATIONS: ["conversations"] as const,
  CONVERSATIONS_LIST: (params: ConversationListParams) =>
    ["conversations", "list", params] as const,
  CONVERSATION: (id: string) => ["conversations", id] as const,
} as const;

export const ConversationsService = {
  async list(params: ConversationListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set("type", params.type);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const url = queryString
      ? `/ai/conversations?${queryString}`
      : "/ai/conversations";
    const { data } = await http.get<{
      conversations: Conversation[];
      pagination: PaginationResult;
    }>(url);
    return data;
  },

  async getById(id: string) {
    const { data } = await http.get<{
      conversation: Conversation;
      messages: ConversationMessage[];
    }>(`/ai/conversations/${id}`);
    return data;
  },

  async create(payload: CreateConversationRequest) {
    const { data } = await http.post<{ conversation: Conversation }>(
      "/ai/conversations",
      payload
    );
    return data;
  },

  async saveMessages(id: string, payload: SaveMessagesRequest) {
    const { data } = await http.patch<{ success: boolean }>(
      `/ai/conversations/${id}/messages`,
      payload
    );
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(
      `/ai/conversations/${id}`
    );
    return data;
  },
} as const;
