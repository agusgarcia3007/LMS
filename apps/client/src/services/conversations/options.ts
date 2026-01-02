import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ConversationsService,
  QUERY_KEYS,
  type ConversationListParams,
  type CreateConversationRequest,
  type SaveMessagesRequest,
} from "./service";

export const conversationsListOptions = (params: ConversationListParams = {}) =>
  queryOptions({
    queryKey: QUERY_KEYS.CONVERSATIONS_LIST(params),
    queryFn: () => ConversationsService.list(params),
    staleTime: 30 * 1000,
  });

export const conversationOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.CONVERSATION(id),
    queryFn: () => ConversationsService.getById(id),
    enabled: !!id,
  });

export const useCreateConversationOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: CreateConversationRequest) =>
      ConversationsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });
    },
  });
};

export const useSaveMessagesOptions = () => {
  return mutationOptions({
    mutationFn: ({ id, ...payload }: { id: string } & SaveMessagesRequest) =>
      ConversationsService.saveMessages(id, payload),
  });
};

export const useDeleteConversationOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ConversationsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });
    },
  });
};
