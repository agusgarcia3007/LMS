import { useMutation } from "@tanstack/react-query";
import { updateUserOptions, deleteUserOptions } from "./options";

export const useUpdateUser = () => useMutation(updateUserOptions());

export const useDeleteUser = () => useMutation(deleteUserOptions());
