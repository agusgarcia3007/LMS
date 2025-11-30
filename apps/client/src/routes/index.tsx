import { Header } from "@/components/header";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { HeroSection } from "@/components/campus/hero-section";
import { CourseGrid } from "@/components/campus/course-grid";
import { useCampusTenant, useCampusCourses, useCampusStats } from "@/services/campus/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isCampus } = Route.useRouteContext();

  if (isCampus) {
    return <CampusHome />;
  }

  return <MainHome />;
}

function MainHome() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">{t("home.welcome")}</h1>
      </main>
    </div>
  );
}

function CampusHome() {
  const { data: tenantData, isLoading: tenantLoading } = useCampusTenant();
  const { data: coursesData, isLoading: coursesLoading } = useCampusCourses({ limit: 8 });
  const { data: statsData } = useCampusStats();

  if (tenantLoading) {
    return <CampusSkeleton />;
  }

  if (!tenantData?.tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Tenant no encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CampusHeader tenant={tenantData.tenant} />
      <main className="flex-1">
        <HeroSection tenant={tenantData.tenant} stats={statsData?.stats} />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {coursesLoading ? (
            <CourseGridSkeleton />
          ) : (
            <CourseGrid
              courses={coursesData?.courses || []}
              title="Cursos destacados"
              description="Explora nuestros cursos mas populares"
            />
          )}
        </section>
      </main>
      <CampusFooter tenant={tenantData.tenant} />
    </div>
  );
}

function CampusSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-16 border-b border-border/40 bg-background" />
      <div className="mx-auto max-w-7xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="mx-auto mb-6 h-8 w-48" />
          <Skeleton className="mx-auto mb-4 h-12 w-full max-w-lg" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
      </div>
    </div>
  );
}

function CourseGridSkeleton() {
  return (
    <div>
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-8 h-5 w-72" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border/50">
            <Skeleton className="aspect-video w-full" />
            <div className="p-5">
              <Skeleton className="mb-3 h-6 w-24" />
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="mb-4 h-4 w-3/4" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
