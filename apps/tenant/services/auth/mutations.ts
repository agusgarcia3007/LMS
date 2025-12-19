"use client";

import { useMutation } from "@tanstack/react-query";
import {
  useLoginOptions,
  useSignupOptions,
  forgotPasswordOptions,
  resetPasswordOptions,
  useLogoutOptions,
  verifyEmailOptions,
  useResendVerificationOptions,
} from "./options";

export function useLogin() {
  return useMutation(useLoginOptions());
}

export function useSignup() {
  return useMutation(useSignupOptions());
}

export function useForgotPassword() {
  return useMutation(forgotPasswordOptions());
}

export function useResetPassword() {
  return useMutation(resetPasswordOptions());
}

export function useLogout() {
  return useMutation(useLogoutOptions());
}

export function useVerifyEmail() {
  return useMutation(verifyEmailOptions());
}

export function useResendVerification() {
  return useMutation(useResendVerificationOptions());
}
