"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/providers/i18n-provider";
import { ProfileService, QUERY_KEYS } from "./service";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.updateName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
      toast.success(i18n.t("profile.updateSuccess"));
    },
  });
};

export const useConfirmAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.confirmAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
      toast.success(i18n.t("profile.avatarUploaded"));
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
      toast.success(i18n.t("profile.avatarDeleted"));
    },
  });
};
