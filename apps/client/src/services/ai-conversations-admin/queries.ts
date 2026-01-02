import { useQuery } from "@tanstack/react-query";
import {
  adminConversationsListOptions,
  adminConversationOptions,
  adminConversationsAnalyticsOptions,
} from "./options";
import type { AdminConversationsListParams } from "./service";

export const useAdminConversationsList = (
  params: AdminConversationsListParams = {}
) => useQuery(adminConversationsListOptions(params));

export const useAdminConversation = (
  id: string,
  options?: { enabled?: boolean }
) => useQuery({ ...adminConversationOptions(id), ...options });

export const useAdminConversationsAnalytics = () =>
  useQuery(adminConversationsAnalyticsOptions());
