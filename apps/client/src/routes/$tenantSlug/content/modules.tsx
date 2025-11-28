import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/content/modules")({
  component: ModulesPage,
});

function ModulesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Modules</h1>
      <p className="text-muted-foreground mt-2">Manage your modules here.</p>
    </div>
  );
}
