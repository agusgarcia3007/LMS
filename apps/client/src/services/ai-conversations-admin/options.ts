import { queryOptions } from "@tanstack/react-query";
import {
  AdminConversationsService,
  QUERY_KEYS,
  type AdminConversationsListParams,
} from "./service";

export const adminConversationsListOptions = (
  params: AdminConversationsListParams = {}
) =>
  queryOptions({
    queryKey: QUERY_KEYS.ADMIN_CONVERSATIONS_LIST(params),
    queryFn: () => AdminConversationsService.list(params),
    staleTime: 30 * 1000,
  });

export const adminConversationOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.ADMIN_CONVERSATION(id),
    queryFn: () => AdminConversationsService.getById(id),
    enabled: !!id,
  });

export const adminConversationsAnalyticsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.ADMIN_CONVERSATIONS_ANALYTICS,
    queryFn: () => AdminConversationsService.getAnalytics(),
    staleTime: 60 * 1000,
  });
