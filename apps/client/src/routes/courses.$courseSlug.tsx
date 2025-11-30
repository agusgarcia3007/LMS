import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { CampusHeader } from "@/components/campus/header";
import { CampusFooter } from "@/components/campus/footer";
import { CourseHeader } from "@/components/campus/course-detail/course-header";
import { CourseCurriculum } from "@/components/campus/course-detail/course-curriculum";
import {
  CourseSidebar,
  CourseRequirements,
  CourseObjectives,
  CourseInstructor,
} from "@/components/campus/course-detail/course-sidebar";
import { useCampusTenant, useCampusCourse } from "@/services/campus/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/courses/$courseSlug")({
  beforeLoad: ({ context }) => {
    if (!context.isCampus) {
      throw redirect({ to: "/" });
    }
  },
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { courseSlug } = Route.useParams();
  const { data: tenantData, isLoading: tenantLoading } = useCampusTenant();
  const { data: courseData, isLoading: courseLoading } = useCampusCourse(courseSlug);

  if (tenantLoading || !tenantData?.tenant) {
    return <PageSkeleton />;
  }

  if (courseLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <CampusHeader tenant={tenantData.tenant} />
        <main className="flex-1">
          <CourseDetailSkeleton />
        </main>
        <CampusFooter tenant={tenantData.tenant} />
      </div>
    );
  }

  if (!courseData?.course) {
    return (
      <div className="flex min-h-screen flex-col">
        <CampusHeader tenant={tenantData.tenant} />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-2xl font-bold">Curso no encontrado</h1>
          <p className="text-muted-foreground">
            El curso que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/courses">
            <Button>Ver todos los cursos</Button>
          </Link>
        </main>
        <CampusFooter tenant={tenantData.tenant} />
      </div>
    );
  }

  const { course } = courseData;

  return (
    <div className="flex min-h-screen flex-col">
      <CampusHeader tenant={tenantData.tenant} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <ChevronLeft className="size-4" />
              Volver a cursos
            </Button>
          </Link>
        </div>

        <CourseHeader course={course} />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold">Acerca de este curso</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <CourseObjectives objectives={course.objectives} />
              <CourseCurriculum course={course} />
              <CourseRequirements requirements={course.requirements} />
              <CourseInstructor course={course} />
            </div>

            <div className="lg:col-span-1">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </main>

      <CampusFooter tenant={tenantData.tenant} />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-16 border-b border-border/40" />
      <CourseDetailSkeleton />
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div>
      <div className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-4 h-10 w-full max-w-2xl" />
          <Skeleton className="mb-6 h-5 w-96" />
          <div className="flex gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <Skeleton className="mb-4 h-7 w-48" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="mb-4 h-7 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
