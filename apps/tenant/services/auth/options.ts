"use client";

import { setTokens } from "@/lib/http";
import { QUERY_KEYS } from "@/services/profile/service";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "./service";

export const useLoginOptions = () => {
  const queryClient = useQueryClient();
  return {
    mutationFn: AuthService.login,
    onSuccess: (data: Awaited<ReturnType<typeof AuthService.login>>) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
  };
};

export const useSignupOptions = () => {
  const queryClient = useQueryClient();
  return {
    mutationFn: AuthService.signup,
    onSuccess: (data: Awaited<ReturnType<typeof AuthService.signup>>) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
  };
};

export const refreshOptions = () => ({
  mutationFn: AuthService.refresh,
  onSuccess: (data: Awaited<ReturnType<typeof AuthService.refresh>>) => {
    localStorage.setItem("accessToken", data.accessToken);
  },
});

export const forgotPasswordOptions = () => ({
  mutationFn: AuthService.forgotPassword,
});

export const resetPasswordOptions = () => ({
  mutationFn: AuthService.resetPassword,
});

export const useLogoutOptions = () => {
  const queryClient = useQueryClient();
  return {
    mutationFn: AuthService.logout,
    onSettled: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  };
};

export const verifyEmailOptions = () => ({
  mutationFn: AuthService.verifyEmail,
});

export const useResendVerificationOptions = () => {
  const queryClient = useQueryClient();
  return {
    mutationFn: AuthService.resendVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
  };
};
