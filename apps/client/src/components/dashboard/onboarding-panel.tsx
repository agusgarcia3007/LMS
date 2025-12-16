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
  X,
  ListChecks,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingSteps, Tenant } from "@/services/tenants/service";

type OnboardingPanelProps = {
  tenant: Tenant;
  steps: OnboardingSteps;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
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

export function OnboardingPanel({
  tenant,
  steps,
  isOpen,
  onClose,
  onOpen,
}: OnboardingPanelProps) {
  const { t } = useTranslation();

  const completedCount = Object.values(steps).filter(Boolean).length;
  const totalSteps = stepConfig.length;
  const progress = (completedCount / totalSteps) * 100;

  return (
    <>
      <Button
        variant="primary"
        size="icon"
        className={cn(
          "fixed bottom-4 right-4 z-40 size-12 rounded-full shadow-lg transition-all duration-300 sm:bottom-6 sm:right-6",
          isOpen
            ? "pointer-events-none scale-0 opacity-0"
            : "scale-100 opacity-100"
        )}
        onClick={onOpen}
      >
        <ListChecks className="size-5" />
      </Button>

      <div
        className={cn(
          "fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ease-in-out",
          "sm:bottom-6 sm:right-6 sm:w-full",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks className="size-5 text-primary" />
                <CardTitle className="text-base">
                  {t("dashboard.onboarding.title")}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t("dashboard.onboarding.progress", {
                  completed: completedCount,
                  total: totalSteps,
                })}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardHeader>

          <CardContent className="max-h-[50vh] space-y-1 overflow-y-auto pb-4 sm:max-h-[60vh]">
            {stepConfig.map(({ key, href }) => {
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
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3.5" />
                      </div>
                    ) : (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                        <Circle className="size-2 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate text-sm font-medium",
                          isCompleted && "text-muted-foreground line-through"
                        )}
                      >
                        {t(`dashboard.onboarding.steps.${key}.title`)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t(`dashboard.onboarding.steps.${key}.description`)}
                      </p>
                    </div>
                  </div>
                  {!isCompleted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      asChild
                    >
                      <Link to={href(tenant.slug)}>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
