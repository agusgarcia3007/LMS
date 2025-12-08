import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/content/quizzes")({
  component: QuizzesLayout,
});

function QuizzesLayout() {
  return <Outlet />;
}
