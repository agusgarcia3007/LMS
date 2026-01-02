import type { Tenant, Course } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

export async function fetchTenantBySlug(slug: string): Promise<Tenant | null> {
  const response = await fetch(`${API_URL}/campus/tenant`, {
    headers: { "X-Tenant-Slug": slug },
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.tenant;
}

export async function fetchTenantByCustomDomain(
  hostname: string
): Promise<Tenant | null> {
  const response = await fetch(
    `${API_URL}/campus/resolve?hostname=${encodeURIComponent(hostname)}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.tenant;
}

export async function fetchCourses(
  slug: string,
  options?: { limit?: number }
): Promise<Course[]> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));

  const response = await fetch(
    `${API_URL}/campus/courses?${params.toString()}`,
    {
      headers: { "X-Tenant-Slug": slug },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.courses;
}
