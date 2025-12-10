import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-courses")({
  beforeLoad: () => {
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("accessToken");
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: MyCoursesLayout,
});

function MyCoursesLayout() {
  return <Outlet />;
}
