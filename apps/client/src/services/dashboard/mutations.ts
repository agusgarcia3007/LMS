import { useMutation } from "@tanstack/react-query";
import { useDeleteWaitlistOptions } from "./options";

export const useDeleteWaitlist = () => useMutation(useDeleteWaitlistOptions());
