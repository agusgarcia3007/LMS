import { http, clearTokens } from "@/lib/http";

export const AuthService = {
  async logout() {
    try {
      await http.post("/auth/logout");
    } finally {
      clearTokens();
    }
  },
} as const;
