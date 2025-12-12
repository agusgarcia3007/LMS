import { http } from "@/lib/http";

export type JoinWaitlistResponse = {
  success: boolean;
  isNew: boolean;
};

export const WaitlistService = {
  async join(email: string) {
    const { data } = await http.post<JoinWaitlistResponse>("/waitlist", {
      email,
    });
    return data;
  },
} as const;
