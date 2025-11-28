import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/content/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Classes</h1>
      <p className="text-muted-foreground mt-2">Manage your classes here.</p>
    </div>
  );
}
