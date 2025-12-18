"use client";

import { useTranslation } from "react-i18next";
import { List, ArrowSquareOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { User } from "@/services/profile/service";
import type { Tenant } from "@/services/tenants/service";

type DashboardHeaderProps = {
  tenant: Tenant;
  user: User;
  onMenuClick: () => void;
};

function getCampusUrl(slug: string, customDomain?: string | null): string {
  if (customDomain) {
    return `https://${customDomain}`;
  }
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000";
  const protocol = baseDomain.includes("localhost") ? "http" : "https";
  return `${protocol}://${slug}.${baseDomain}`;
}

export function DashboardHeader({ tenant, user, onMenuClick }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const campusUrl = getCampusUrl(tenant.slug, tenant.customDomain);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <List className="size-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <a href={campusUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowSquareOut className="size-4" />
            {t("header.viewCampus")}
          </Button>
        </a>
      </div>
    </header>
  );
}
