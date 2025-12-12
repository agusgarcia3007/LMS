import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { getTenantFromRequest } from "@/lib/tenant.server";

export const Route = createFileRoute("/courses")({
  loader: async () => {
    const tenantInfo = await getTenantFromRequest();
    return { isCampus: tenantInfo.isCampus };
  },
  component: CoursesLayout,
});

function CoursesLayout() {
  const { isCampus } = Route.useLoaderData();

  if (!isCampus) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
