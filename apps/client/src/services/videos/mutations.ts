import { useMutation } from "@tanstack/react-query";
import {
  useCreateVideoOptions,
  useUpdateVideoOptions,
  useDeleteVideoOptions,
  useConfirmVideoFileOptions,
  useDeleteVideoFileOptions,
  useConfirmVideoStandaloneOptions,
} from "./options";

export const useCreateVideo = () => useMutation(useCreateVideoOptions());

export const useUpdateVideo = () => useMutation(useUpdateVideoOptions());

export const useDeleteVideo = () => useMutation(useDeleteVideoOptions());

export const useConfirmVideoFile = () => useMutation(useConfirmVideoFileOptions());

export const useDeleteVideoFile = () => useMutation(useDeleteVideoFileOptions());

export const useConfirmVideoStandalone = () => useMutation(useConfirmVideoStandaloneOptions());
