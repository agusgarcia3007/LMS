import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { profileOptions } from "@/services/profile/options";
import { tenantOptions } from "@/services/tenants/options";

export const Route = createFileRoute("/$tenantSlug")({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw redirect({ to: "/login" });
    }

    // Fetch profile and tenant data in parallel for better performance
    const [profileData, tenantData] = await Promise.all([
      queryClient.ensureQueryData(profileOptions()),
      queryClient.ensureQueryData(tenantOptions(params.tenantSlug)),
    ]);

    if (!profileData?.user) {
      throw redirect({ to: "/login" });
    }

    const { user } = profileData;

    if (user.role !== "owner" && user.role !== "superadmin") {
      throw redirect({ to: "/" });
    }

    if (!tenantData?.tenant) {
      throw redirect({ to: "/" });
    }

    const { tenant } = tenantData;

    if (user.role === "owner" && user.tenantId !== tenant.id) {
      throw redirect({ to: "/" });
    }

    return { user, tenant };
  },
  component: TenantDashboardLayout,
});

function TenantDashboardLayout() {
  const { user, tenant } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <DashboardSidebar tenant={tenant} user={user} />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
