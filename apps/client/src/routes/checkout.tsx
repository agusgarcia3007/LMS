import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  ssr: false,
  beforeLoad: () => {
    const isAuthenticated = !!localStorage.getItem("accessToken");
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: CheckoutLayout,
});

function CheckoutLayout() {
  return <Outlet />;
}
