import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Settings,
  FolderTree,
  UserCircle,
  Layers,
  BookOpen,
  Check,
  Circle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingSteps } from "@/services/tenants/service";

type OnboardingChecklistProps = {
  tenantSlug: string;
  steps: OnboardingSteps;
};

const stepConfig = [
  {
    key: "basicInfo" as const,
    icon: Settings,
    href: (slug: string) => `/${slug}/site/configuration`,
  },
  {
    key: "category" as const,
    icon: FolderTree,
    href: (slug: string) => `/${slug}/content/categories`,
  },
  {
    key: "instructor" as const,
    icon: UserCircle,
    href: (slug: string) => `/${slug}/content/instructors`,
  },
  {
    key: "module" as const,
    icon: Layers,
    href: (slug: string) => `/${slug}/content/modules`,
  },
  {
    key: "course" as const,
    icon: BookOpen,
    href: (slug: string) => `/${slug}/content/courses`,
  },
];

export function OnboardingChecklist({
  tenantSlug,
  steps,
}: OnboardingChecklistProps) {
  const { t } = useTranslation();

  const completedCount = Object.values(steps).filter(Boolean).length;
  const totalSteps = stepConfig.length;
  const progress = (completedCount / totalSteps) * 100;
  const allCompleted = completedCount === totalSteps;

  if (allCompleted) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">{t("dashboard.onboarding.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.onboarding.progress", {
              completed: completedCount,
              total: totalSteps,
            })}
          </CardDescription>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="grid gap-1">
        {stepConfig.map(({ key, icon: Icon, href }) => {
          const isCompleted = steps[key];
          return (
            <div
              key={key}
              className={cn(
                "flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50",
                isCompleted && "opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                    <Circle className="size-2 text-muted-foreground/50" />
                  </div>
                )}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-muted-foreground line-through"
                    )}
                  >
                    {t(`dashboard.onboarding.steps.${key}.title`)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(`dashboard.onboarding.steps.${key}.description`)}
                  </p>
                </div>
              </div>
              {!isCompleted && (
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <Link to={href(tenantSlug)}>
                    <Icon className="size-4" />
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
