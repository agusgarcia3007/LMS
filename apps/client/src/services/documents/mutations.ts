import { useMutation } from "@tanstack/react-query";
import {
  useCreateDocumentOptions,
  useUpdateDocumentOptions,
  useDeleteDocumentOptions,
  useConfirmDocumentFileOptions,
  useDeleteDocumentFileOptions,
  useConfirmDocumentStandaloneOptions,
} from "./options";

export const useCreateDocument = () => useMutation(useCreateDocumentOptions());

export const useUpdateDocument = () => useMutation(useUpdateDocumentOptions());

export const useDeleteDocument = () => useMutation(useDeleteDocumentOptions());

export const useConfirmDocumentFile = () => useMutation(useConfirmDocumentFileOptions());

export const useDeleteDocumentFile = () => useMutation(useDeleteDocumentFileOptions());

export const useConfirmDocumentStandalone = () => useMutation(useConfirmDocumentStandaloneOptions());
