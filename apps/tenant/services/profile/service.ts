import { http } from "@/lib/http";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "owner" | "instructor" | "student";
  tenantId: string | null;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  favicon: string | null;
  theme: string | null;
  mode: "light" | "dark" | "auto" | null;
  customTheme: Record<string, string | null> | null;
  customDomain: string | null;
};

export type ProfileResponse = {
  user: User;
  tenant: Tenant | null;
};

export const QUERY_KEYS = {
  PROFILE: ["profile"],
} as const;

export const ProfileService = {
  async get() {
    const { data } = await http.get<ProfileResponse>("/profile/");
    return data;
  },

  async updateName(name: string) {
    const { data } = await http.put<{ user: User }>("/profile/", { name });
    return data;
  },

  async confirmAvatar(key: string) {
    const { data } = await http.post<{ user: User }>("/profile/avatar", { key });
    return data;
  },

  async deleteAvatar() {
    const { data } = await http.delete<{ user: User }>("/profile/avatar");
    return data;
  },
} as const;
