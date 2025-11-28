import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { tenant } = Route.useRouteContext();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to {tenant.name}</h1>
      <p className="text-muted-foreground mt-2">
        Manage your courses, classes, and modules from here.
      </p>
    </div>
  );
}
