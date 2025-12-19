import type { UserRole } from "./types";

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published";
export type ModuleStatus = "draft" | "published";
export type ContentType = "video" | "document" | "quiz";
export type ContentStatus = "draft" | "published";
export type EnrollmentStatus = "active" | "completed" | "cancelled";
export type ItemProgressStatus = "not_started" | "in_progress" | "completed";
export type QuestionType = "multiple_choice" | "multiple_select" | "true_false";

export type TenantTheme = "default" | "slate" | "rose" | "emerald" | "tangerine" | "ocean";
export type TenantMode = "light" | "dark" | "auto";
export type TenantStatus = "active" | "suspended" | "cancelled";
export type TenantPlan = "starter" | "growth" | "scale";

export type SubtitleStatus = "pending" | "processing" | "completed" | "failed";
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface CourseBase {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: CourseStatus;
  level: CourseLevel;
  thumbnailUrl: string | null;
  price: number;
  currency: string;
}

export interface ModuleBase {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  position: number;
  status: ModuleStatus;
}

export interface ContentBase {
  id: string;
  moduleId: string;
  title: string;
  type: ContentType;
  position: number;
  status: ContentStatus;
  duration: number | null;
}

export interface EnrollmentBase {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

export interface TenantBase {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  theme: TenantTheme;
  mode: TenantMode;
  status: TenantStatus;
  plan: TenantPlan;
}
