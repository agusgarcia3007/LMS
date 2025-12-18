import { Suspense } from "react";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { DashboardLayoutClient } from "./dashboard-layout-client";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
};

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { tenantSlug } = await params;

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardLayoutClient tenantSlug={tenantSlug}>
        {children}
      </DashboardLayoutClient>
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <SpinnerGap className="size-10 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
      </div>
    </div>
  );
}
