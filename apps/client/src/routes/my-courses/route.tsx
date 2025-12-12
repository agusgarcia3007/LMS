import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-courses")({
  ssr: false,
  beforeLoad: () => {
    const isAuthenticated = !!localStorage.getItem("accessToken");
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: MyCoursesLayout,
});

function MyCoursesLayout() {
  return <Outlet />;
}
