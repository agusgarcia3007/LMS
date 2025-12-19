"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SpinnerGap } from "@phosphor-icons/react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { useGetProfile } from "@/services/profile";
import { useTenant } from "@/services/tenants";
import {
  canAccessTenantDashboard,
  canManageSite,
  canViewFinance,
} from "@learnbase/core";
import { getAccessToken } from "@/lib/http";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  tenantSlug: string;
};

function hasValidSubscription(tenant: {
  plan: string | null;
  subscriptionStatus: string | null;
  trialEndsAt: string | null;
}): boolean {
  if (!tenant.plan) {
    return false;
  }
  if (tenant.subscriptionStatus === "active") {
    return true;
  }
  if (
    tenant.subscriptionStatus === "trialing" &&
    tenant.trialEndsAt &&
    new Date(tenant.trialEndsAt) > new Date()
  ) {
    return true;
  }
  return false;
}

export function DashboardLayoutClient({
  children,
  tenantSlug,
}: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: profileData, isLoading: profileLoading } = useGetProfile();
  const { data: tenantData, isLoading: tenantLoading } = useTenant(tenantSlug);

  useEffect(() => {
    if (typeof window !== "undefined" && !getAccessToken()) {
      router.push("/login");
    }
  }, [router]);

  const isLoading = profileLoading || tenantLoading;

  useEffect(() => {
    if (isLoading) return;

    const user = profileData?.user;
    const tenant = tenantData?.tenant;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!canAccessTenantDashboard(user.role)) {
      router.push("/");
      return;
    }

    if (!tenant) {
      router.push("/");
      return;
    }

    if (
      (user.role === "owner" || user.role === "instructor") &&
      user.tenantId !== tenant.id
    ) {
      router.push("/");
      return;
    }

    const isSiteRoute = pathname.includes("/site");
    if (isSiteRoute && !canManageSite(user.role)) {
      router.push(`/${tenantSlug}`);
      return;
    }

    const isSubscriptionRoute = pathname.includes("/finance/subscription");
    if (
      !isSubscriptionRoute &&
      user.role === "owner" &&
      !hasValidSubscription(tenant)
    ) {
      router.push(`/${tenantSlug}/finance/subscription`);
    }
  }, [isLoading, profileData, tenantData, router, pathname, tenantSlug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpinnerGap className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const user = profileData?.user;
  const tenant = tenantData?.tenant;

  if (!user || !tenant) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        tenant={tenant}
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 flex-col">
        <DashboardHeader
          tenant={tenant}
          user={user}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
