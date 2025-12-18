import "server-only";
import type { CampusTenant, CampusCourse, CampusCourseDetail, CampusStats, CampusCategory } from "./service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TenantResponse = { tenant: CampusTenant };
type CoursesResponse = { courses: CampusCourse[] };
type CourseResponse = { course: CampusCourseDetail };
type StatsResponse = { stats: CampusStats };
type CategoriesResponse = { categories: CampusCategory[] };

export async function getCampusTenantServer(slug: string): Promise<TenantResponse | null> {
  if (!slug || !API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/campus/tenant`, {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCampusCoursesServer(slug: string, limit = 8): Promise<CoursesResponse | null> {
  if (!slug || !API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/campus/courses?limit=${limit}`, {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCampusStatsServer(slug: string): Promise<StatsResponse | null> {
  if (!slug || !API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/campus/stats`, {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCampusCategoriesServer(slug: string): Promise<CategoriesResponse | null> {
  if (!slug || !API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/campus/categories`, {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCampusCourseServer(slug: string, courseSlug: string): Promise<CourseResponse | null> {
  if (!slug || !courseSlug || !API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/campus/courses/${courseSlug}`, {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
