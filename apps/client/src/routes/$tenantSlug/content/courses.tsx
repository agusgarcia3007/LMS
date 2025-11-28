import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/content/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Courses</h1>
      <p className="text-muted-foreground mt-2">Manage your courses here.</p>
    </div>
  );
}
