export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string | null;
  price: string | null;
  originalPrice: string | null;
  currency: string | null;
  level: "beginner" | "intermediate" | "advanced" | null;
  language: string;
  tags: string[];
  features: string[];
  requirements: string[];
  objectives: string[];
  modulesCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  categories: { slug: string; name: string }[];
  instructor: {
    name: string | null;
    avatar: string | null;
    title: string | null;
    bio: string | null;
  } | null;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  favicon: string | null;
  theme:
    | "default"
    | "slate"
    | "rose"
    | "emerald"
    | "tangerine"
    | "ocean"
    | null;
  mode: "light" | "dark" | "auto" | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroCta: string | null;
  footerText: string | null;
  heroPattern: "none" | "grid" | "dots" | "waves" | null;
  coursesPagePattern: "none" | "grid" | "dots" | "waves" | null;
  showHeaderName: boolean | null;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  } | null;
  contactEmail: string | null;
  customTheme: Record<string, string> | null;
  aiAssistantSettings: {
    enabled?: boolean;
    name?: string;
    customPrompt?: string;
    preferredLanguage?: "auto" | "en" | "es" | "pt";
    tone?: "professional" | "friendly" | "casual" | "academic";
    avatarUrl?: string | null;
  } | null;
  authSettings: {
    provider: "local" | "firebase";
    firebaseProjectId?: string;
    firebaseApiKey?: string;
    firebaseAuthDomain?: string;
    enableGoogle?: boolean;
    enableApple?: boolean;
    enableEmailPassword?: boolean;
  } | null;
};
