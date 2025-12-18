"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "./service";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}
