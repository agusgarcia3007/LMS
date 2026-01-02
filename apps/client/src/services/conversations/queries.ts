import { useQuery } from "@tanstack/react-query";
import {
  conversationsListOptions,
  conversationOptions,
} from "./options";
import type { ConversationListParams } from "./service";

export const useConversationsList = (
  params: ConversationListParams = {},
  options?: { enabled?: boolean }
) =>
  useQuery({
    ...conversationsListOptions(params),
    ...options,
  });

export const useConversation = (id: string, options?: { enabled?: boolean }) =>
  useQuery({
    ...conversationOptions(id),
    ...options,
  });
