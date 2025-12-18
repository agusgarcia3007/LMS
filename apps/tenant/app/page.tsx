import { headers } from "next/headers";
import type { Metadata } from "next";
import { BookOpen } from "@phosphor-icons/react/dist/ssr";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { HeroSection } from "@/components/campus/hero-section";
import { CourseGrid } from "@/components/campus/course-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import {
  getCampusTenantServer,
  getCampusCoursesServer,
  getCampusStatsServer,
} from "@/services/campus/server";
import Link from "next/link";

async function getTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-tenant-slug");
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = await getTenantSlug();
  if (!slug) {
    return {
      title: "Campus no encontrado",
      description: "El campus solicitado no existe",
    };
  }

  const tenantData = await getCampusTenantServer(slug);
  if (!tenantData?.tenant) {
    return {
      title: "Campus no encontrado",
      description: "El campus solicitado no existe",
    };
  }

  const tenant = tenantData.tenant;
  const title = tenant.seoTitle || tenant.name;
  const description = tenant.seoDescription || `Bienvenido a ${tenant.name}`;

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

export default async function CampusHomePage() {
  const slug = await getTenantSlug();

  if (!slug) {
    return <CampusNotFound />;
  }

  const [tenantData, coursesData, statsData] = await Promise.all([
    getCampusTenantServer(slug),
    getCampusCoursesServer(slug, 8),
    getCampusStatsServer(slug),
  ]);

  if (!tenantData?.tenant) {
    return <CampusNotFound />;
  }

  const tenant = tenantData.tenant;
  const courses = coursesData?.courses ?? [];
  const stats = statsData?.stats ?? undefined;
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
          <HeroSection tenant={tenant} stats={stats} />
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {courses.length > 0 ? (
              <CourseGrid
                courses={courses}
                title="Cursos destacados"
                description="Explora nuestros cursos mas populares"
              />
            ) : (
              <EmptyState />
            )}
          </section>
        </main>
        <CampusFooter tenant={tenant} />
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <BookOpen className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No hay cursos disponibles</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pronto habra nuevos cursos. Vuelve mas tarde.
      </p>
    </div>
  );
}

function CampusNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl font-bold text-muted-foreground/30">404</div>
        <h1 className="mb-3 text-2xl font-semibold text-foreground">
          Campus no encontrado
        </h1>
        <p className="mb-2 text-muted-foreground">
          El campus solicitado no existe o ha sido desactivado.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          Verifica que la direccion sea correcta o contacta al administrador.
        </p>
        <Link href="https://uselearnbase.com">
          <Button>Ir a la pagina principal</Button>
        </Link>
      </div>
    </div>
  );
}
