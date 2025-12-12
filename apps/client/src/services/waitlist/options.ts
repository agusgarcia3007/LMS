import { mutationOptions } from "@tanstack/react-query";
import { WaitlistService } from "./service";

export const useJoinWaitlistOptions = () =>
  mutationOptions({
    mutationFn: WaitlistService.join,
  });
