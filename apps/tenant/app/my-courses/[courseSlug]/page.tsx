import { headers } from "next/headers";
import type { Metadata } from "next";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { getCampusTenantServer } from "@/services/campus/server";
import { CoursePlayerContent } from "./course-player-content";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

async function getTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-tenant-slug");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const slug = await getTenantSlug();

  if (!slug) {
    return { title: "Aprendiendo", robots: { index: false, follow: false } };
  }

  const tenantData = await getCampusTenantServer(slug);
  const tenant = tenantData?.tenant;
  const siteName = tenant?.seoTitle || tenant?.name || "Campus";

  return {
    title: `Aprendiendo | ${siteName}`,
    description: "Continua tu aprendizaje",
    robots: { index: false, follow: false },
    icons: tenant?.favicon ? { icon: tenant.favicon } : undefined,
  };
}

export default async function CoursePlayerPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const slug = await getTenantSlug();

  if (!slug) {
    return <PlayerNotFound />;
  }

  const tenantData = await getCampusTenantServer(slug);

  if (!tenantData?.tenant) {
    return <PlayerNotFound />;
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
        <CoursePlayerContent courseSlug={courseSlug} />
        <CampusFooter tenant={tenant} />
      </div>
    </>
  );
}

function PlayerNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-2xl font-semibold text-foreground">
          No encontrado
        </h1>
        <p className="text-muted-foreground">
          No se pudo cargar el contenido.
        </p>
      </div>
    </div>
  );
}
