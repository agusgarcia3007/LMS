import { useMutation } from "@tanstack/react-query";
import {
  useCreateConversationOptions,
  useSaveMessagesOptions,
  useDeleteConversationOptions,
} from "./options";

export const useCreateConversation = () =>
  useMutation(useCreateConversationOptions());

export const useSaveMessages = () => useMutation(useSaveMessagesOptions());

export const useDeleteConversation = () =>
  useMutation(useDeleteConversationOptions());
