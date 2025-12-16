import { createServerFn } from "@tanstack/react-start";
import type { CampusTenant, CampusCourse, CampusCourseDetail, CampusStats, CampusCategory } from "./service";

const API_URL = import.meta.env.VITE_API_URL;

type TenantResponse = { tenant: CampusTenant };
type CoursesResponse = { courses: CampusCourse[] };
type CourseResponse = { course: CampusCourseDetail };
type StatsResponse = { stats: CampusStats };
type CategoriesResponse = { categories: CampusCategory[] };

export const getCampusTenantServer = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }): Promise<TenantResponse | null> => {
    if (!slug) return null;
    const response = await fetch(`${API_URL}/campus/tenant`, {
      headers: { "X-Tenant-Slug": slug },
    });
    if (!response.ok) return null;
    return response.json();
  });

export const getCampusCoursesServer = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string; limit?: number }) => d)
  .handler(async ({ data: { slug, limit = 8 } }): Promise<CoursesResponse | null> => {
    if (!slug) return null;
    const response = await fetch(`${API_URL}/campus/courses?limit=${limit}`, {
      headers: { "X-Tenant-Slug": slug },
    });
    if (!response.ok) return null;
    return response.json();
  });

export const getCampusStatsServer = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }): Promise<StatsResponse | null> => {
    if (!slug) return null;
    const response = await fetch(`${API_URL}/campus/stats`, {
      headers: { "X-Tenant-Slug": slug },
    });
    if (!response.ok) return null;
    return response.json();
  });

export const getCampusCourseServer = createServerFn({ method: "GET" })
  .inputValidator((d: { tenantSlug: string; courseSlug: string }) => d)
  .handler(async ({ data: { tenantSlug, courseSlug } }): Promise<CourseResponse | null> => {
    const response = await fetch(`${API_URL}/campus/courses/${courseSlug}`, {
      headers: { "X-Tenant-Slug": tenantSlug },
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  });

export const getCampusCategoriesServer = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data: { slug } }): Promise<CategoriesResponse | null> => {
    if (!slug) return null;
    const response = await fetch(`${API_URL}/campus/categories`, {
      headers: { "X-Tenant-Slug": slug },
    });
    if (!response.ok) return null;
    return response.json();
  });
