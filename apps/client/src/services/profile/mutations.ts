import { useMutation } from "@tanstack/react-query";
import {
  useDeleteAvatarOptions,
  useUpdateProfileOptions,
  useConfirmAvatarOptions,
} from "./options";

export const useUpdateProfile = () => useMutation(useUpdateProfileOptions());
export const useConfirmAvatar = () => useMutation(useConfirmAvatarOptions());
export const useDeleteAvatar = () => useMutation(useDeleteAvatarOptions());
