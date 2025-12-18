"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CaretDown, Folder, BookOpen } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { CampusCourseDetail, CampusCourseModule } from "@/services/campus/service";

type CourseCurriculumProps = {
  course: CampusCourseDetail;
};

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  const { t } = useTranslation();
  const [expandedModule, setExpandedModule] = useState<string | null>(
    course.modules[0]?.id ?? null
  );

  if (!course.modules || course.modules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <BookOpen className="mx-auto size-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          {t("campus.courseDetail.noCurriculum")}
        </p>
      </div>
    );
  }

  const totalItems = course.modules.reduce((acc, m) => acc + m.itemsCount, 0);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t("campus.courseDetail.curriculum")}</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        {course.modules.length} {t("campus.courseDetail.sections")} • {totalItems}{" "}
        {t("campus.courseDetail.classes")}
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        {course.modules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            isExpanded={expandedModule === module.id}
            onToggle={() =>
              setExpandedModule(expandedModule === module.id ? null : module.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

type ModuleSectionProps = {
  module: CampusCourseModule;
  isExpanded: boolean;
  onToggle: () => void;
};

function ModuleSection({ module, isExpanded, onToggle }: ModuleSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between bg-muted/40 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Folder className="size-5 text-muted-foreground" />
          <span className="font-medium">{module.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {module.itemsCount} {t("campus.courseDetail.classes")}
          </span>
          <CaretDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="bg-background">
          {module.description && (
            <p className="border-b border-border/50 px-4 py-3 text-sm text-muted-foreground">
              {module.description}
            </p>
          )}
          <div className="divide-y divide-border/50 px-4">
            {module.itemsCount > 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                {module.itemsCount} {t("campus.courseDetail.classesAvailable")}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                {t("campus.courseDetail.noClasses")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
