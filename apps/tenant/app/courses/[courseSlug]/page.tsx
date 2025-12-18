import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft, BookOpen } from "@phosphor-icons/react/dist/ssr";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import {
  CourseHeader,
  CourseSidebar,
  CourseCurriculum,
  CourseRequirements,
  CourseObjectives,
  CourseInstructor,
} from "@/components/campus/course-detail";
import { Button } from "@/components/ui/button";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { getCampusTenantServer, getCampusCourseServer } from "@/services/campus/server";

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
    return {
      title: "Curso no encontrado",
      description: "El curso solicitado no existe",
    };
  }

  const [tenantData, courseData] = await Promise.all([
    getCampusTenantServer(slug),
    getCampusCourseServer(slug, courseSlug),
  ]);

  if (!tenantData?.tenant || !courseData?.course) {
    return {
      title: "Curso no encontrado",
      description: "El curso solicitado no existe",
    };
  }

  const tenant = tenantData.tenant;
  const course = courseData.course;
  const siteName = tenant.seoTitle || tenant.name;
  const title = `${course.title} | ${siteName}`;
  const description = course.shortDescription || course.description;

  return {
    title,
    description,
    keywords: tenant.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: course.thumbnail ? [{ url: course.thumbnail }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.thumbnail ? [course.thumbnail] : undefined,
    },
    icons: tenant.favicon ? { icon: tenant.favicon } : undefined,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const slug = await getTenantSlug();

  if (!slug) {
    return <CourseNotFound />;
  }

  const [tenantData, courseData] = await Promise.all([
    getCampusTenantServer(slug),
    getCampusCourseServer(slug, courseSlug),
  ]);

  if (!tenantData?.tenant) {
    return <CourseNotFound />;
  }

  const tenant = tenantData.tenant;
  const course = courseData?.course ?? null;
  const { themeClass, customStyles } = computeThemeStyles(tenant);
  const fontLinks = createGoogleFontLinks(tenant.customTheme);

  if (!course) {
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
          <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <BookOpen className="size-16 text-muted-foreground/50" />
            <h1 className="text-2xl font-bold">Curso no encontrado</h1>
            <p className="text-muted-foreground">
              El curso que buscas no existe o ha sido eliminado.
            </p>
            <Link href="/courses">
              <Button>Ver todos los cursos</Button>
            </Link>
          </main>
          <CampusFooter tenant={tenant} />
        </div>
      </>
    );
  }

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
          <div className="relative">
            <CourseHeader
              course={course}
              pattern={tenant.coursesPagePattern || "grid"}
            />

            <div className="absolute right-4 top-0 hidden w-[340px] lg:right-8 lg:block xl:right-[max(2rem,calc((100vw-80rem)/2+2rem))]">
              <div className="sticky top-20 pt-6">
                <CourseSidebar course={course} />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 lg:hidden">
            <CourseSidebar course={course} />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:max-w-[calc(100%-380px)]">
              <div className="mb-6">
                <Link href="/courses">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    <CaretLeft className="size-4" />
                    Volver a cursos
                  </Button>
                </Link>
              </div>

              <div className="space-y-10">
                <CourseObjectives objectives={course.objectives} />

                <CourseCurriculum course={course} />

                {course.description && (
                  <div>
                    <h2 className="mb-4 text-xl font-bold">Descripcion</h2>
                    <div className="prose prose-zinc max-w-none dark:prose-invert">
                      <p className="leading-relaxed text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                  </div>
                )}

                <CourseRequirements requirements={course.requirements} />

                <CourseInstructor course={course} />
              </div>
            </div>
          </div>
        </main>

        <CampusFooter tenant={tenant} />
      </div>
    </>
  );
}

function CourseNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <BookOpen className="mx-auto size-16 text-muted-foreground/50" />
        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          Curso no encontrado
        </h1>
        <p className="mt-2 text-muted-foreground">
          El curso que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/courses" className="mt-6 inline-block">
          <Button>Ver todos los cursos</Button>
        </Link>
      </div>
    </div>
  );
}
