import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getTenantFromHost } from "@/lib/tenant";
import { isClient } from "@/lib/utils";

export const Route = createFileRoute("/courses")({
  beforeLoad: ({ context }) => {
    const localIsCampus = isClient() ? getTenantFromHost().isCampus : false;
    if (!context.isCampus && !localIsCampus) {
      throw redirect({ to: "/" });
    }
  },
  component: CoursesLayout,
});

function CoursesLayout() {
  return <Outlet />;
}
