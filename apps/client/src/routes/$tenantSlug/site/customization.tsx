import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PatternSelector } from "@/components/tenant-configuration/pattern-selector";
import { useGetTenant, useUpdateTenant } from "@/services/tenants";
import type { BackgroundPattern } from "@/services/tenants/service";

export const Route = createFileRoute("/$tenantSlug/site/customization")({
  component: CustomizationPage,
});

function CustomizationPage() {
  const { t } = useTranslation();
  const { tenantSlug } = useParams({ from: "/$tenantSlug/site/customization" });

  const { data, isLoading } = useGetTenant(tenantSlug);
  const tenant = data?.tenant;

  const updateMutation = useUpdateTenant(
    tenantSlug,
    t("dashboard.site.customization.updateSuccess")
  );

  const [heroPattern, setHeroPattern] = useState<BackgroundPattern>("grid");
  const [coursesPagePattern, setCoursesPagePattern] = useState<BackgroundPattern>("grid");

  useEffect(() => {
    if (tenant) {
      setHeroPattern(tenant.heroPattern ?? "grid");
      setCoursesPagePattern(tenant.coursesPagePattern ?? "grid");
    }
  }, [tenant]);

  const handleSave = () => {
    if (!tenant) return;
    updateMutation.mutate({
      id: tenant.id,
      name: tenant.name,
      heroPattern,
      coursesPagePattern,
    });
  };

  const hasChanges =
    tenant &&
    (heroPattern !== (tenant.heroPattern ?? "grid") ||
      coursesPagePattern !== (tenant.coursesPagePattern ?? "grid"));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("dashboard.site.customization.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("dashboard.site.customization.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.site.customization.heroPattern")}</CardTitle>
          <CardDescription>
            {t("dashboard.site.customization.heroPatternHelp")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatternSelector value={heroPattern} onChange={setHeroPattern} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.site.customization.coursesPagePattern")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.site.customization.coursesPagePatternHelp")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatternSelector
            value={coursesPagePattern}
            onChange={setCoursesPagePattern}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          isLoading={updateMutation.isPending}
        >
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
