import { headers } from "next/headers";
import type { Metadata } from "next";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  getCampusTenantServer,
  getCampusCoursesServer,
  getCampusCategoriesServer,
} from "@/services/campus/server";
import type { BackgroundPattern } from "@/services/campus/service";
import { CoursesContent } from "./courses-content";

const PATTERN_CLASSES: Record<BackgroundPattern, string> = {
  none: "",
  grid: "text-primary/15 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
  dots: "text-primary/20 bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
  waves: "text-primary/15 bg-[radial-gradient(ellipse_100%_100%_at_100%_50%,transparent_20%,currentColor_21%,currentColor_22%,transparent_23%),radial-gradient(ellipse_100%_100%_at_0%_50%,transparent_20%,currentColor_21%,currentColor_22%,transparent_23%)] bg-[size:32px_16px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
};

async function getTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-tenant-slug");
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = await getTenantSlug();
  if (!slug) {
    return {
      title: "Cursos",
      description: "Explora nuestra coleccion de cursos",
    };
  }

  const tenantData = await getCampusTenantServer(slug);
  if (!tenantData?.tenant) {
    return {
      title: "Cursos",
      description: "Explora nuestra coleccion de cursos",
    };
  }

  const tenant = tenantData.tenant;
  const title = tenant.seoTitle
    ? `Cursos | ${tenant.seoTitle}`
    : `Cursos | ${tenant.name}`;
  const description =
    tenant.seoDescription ||
    `Explora nuestra coleccion completa de cursos en ${tenant.name}`;

  return {
    title,
    description,
    keywords: tenant.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: tenant.favicon ? { icon: tenant.favicon } : undefined,
  };
}

export default async function CoursesPage() {
  const slug = await getTenantSlug();

  if (!slug) {
    return <CoursesNotFound />;
  }

  const [tenantData, coursesData, categoriesData] = await Promise.all([
    getCampusTenantServer(slug),
    getCampusCoursesServer(slug, 100),
    getCampusCategoriesServer(slug),
  ]);

  if (!tenantData?.tenant) {
    return <CoursesNotFound />;
  }

  const tenant = tenantData.tenant;
  const courses = coursesData?.courses ?? [];
  const categories = categoriesData?.categories ?? [];
  const { themeClass, customStyles } = computeThemeStyles(tenant);
  const fontLinks = createGoogleFontLinks(tenant.customTheme);
  const pattern: BackgroundPattern = tenant.coursesPagePattern || "grid";

  return (
    <>
      {fontLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div
        className={cn("flex min-h-screen flex-col overflow-x-hidden", themeClass)}
        style={customStyles}
      >
        <CampusHeader tenant={tenant} />

        <main className="flex-1">
          <div className="relative overflow-hidden border-b border-border/40 bg-muted/30">
            <div className={cn("absolute inset-0", PATTERN_CLASSES[pattern])} />
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                Todos los cursos
              </h1>
              <p className="text-muted-foreground">
                Explora nuestra coleccion completa de cursos
              </p>
            </div>
          </div>

          <CoursesContent
            initialCourses={courses}
            categories={categories}
          />
        </main>

        <CampusFooter tenant={tenant} />
      </div>
    </>
  );
}

function CoursesNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl font-bold text-muted-foreground/30">404</div>
        <h1 className="mb-3 text-2xl font-semibold text-foreground">
          Cursos no disponibles
        </h1>
        <p className="mb-8 text-muted-foreground">
          No se encontraron cursos para este campus.
        </p>
      </div>
    </div>
  );
}
