import { headers } from "next/headers";
import type { Metadata } from "next";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { getCampusTenantServer } from "@/services/campus/server";
import { MyCoursesContent } from "./my-courses-content";

async function getTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-tenant-slug");
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = await getTenantSlug();
  if (!slug) {
    return { title: "Mis Cursos" };
  }

  const tenantData = await getCampusTenantServer(slug);
  const tenant = tenantData?.tenant;
  const siteName = tenant?.seoTitle || tenant?.name || "Campus";

  return {
    title: `Mis Cursos | ${siteName}`,
    description: "Continua aprendiendo donde lo dejaste",
    robots: { index: false, follow: false },
    icons: tenant?.favicon ? { icon: tenant.favicon } : undefined,
  };
}

export default async function MyCoursesPage() {
  const slug = await getTenantSlug();

  if (!slug) {
    return <MyCoursesNotFound />;
  }

  const tenantData = await getCampusTenantServer(slug);

  if (!tenantData?.tenant) {
    return <MyCoursesNotFound />;
  }

  const tenant = tenantData.tenant;
  const { themeClass, customStyles } = computeThemeStyles(tenant);
  const fontLinks = createGoogleFontLinks(tenant.customTheme);

  return (
    <>
      {fontLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div
        className={cn("flex min-h-screen flex-col", themeClass)}
        style={customStyles}
      >
        <CampusHeader tenant={tenant} />

        <main className="flex-1">
          <div className="border-b border-border/40 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                Mis Cursos
              </h1>
              <p className="text-muted-foreground">
                Continua aprendiendo donde lo dejaste
              </p>
            </div>
          </div>

          <MyCoursesContent />
        </main>

        <CampusFooter tenant={tenant} />
      </div>
    </>
  );
}

function MyCoursesNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-2xl font-semibold text-foreground">
          Campus no encontrado
        </h1>
        <p className="text-muted-foreground">
          No se pudo cargar el campus.
        </p>
      </div>
    </div>
  );
}
