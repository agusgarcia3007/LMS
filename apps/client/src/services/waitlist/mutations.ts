import { useMutation } from "@tanstack/react-query";
import { useJoinWaitlistOptions } from "./options";

export const useJoinWaitlist = () => useMutation(useJoinWaitlistOptions());
