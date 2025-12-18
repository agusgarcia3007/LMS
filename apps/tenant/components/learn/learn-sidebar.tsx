"use client";

import { useTranslation } from "react-i18next";
import {
  CaretDown,
  CaretRight,
  PlayCircle,
  FileText,
  ListChecks,
  CheckCircle,
  Circle,
  SpinnerGap,
} from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useModuleItems } from "@/services/learn";
import type {
  LearnCourse,
  LearnModuleLite,
  CourseProgress,
  ContentType,
  ItemProgressStatus,
} from "@/services/learn/service";

type LearnSidebarProps = {
  course: LearnCourse;
  modules: LearnModuleLite[];
  progress: CourseProgress;
  selectedItemId: string | null;
  expandedModules: Set<string>;
  onSelectItem: (itemId: string, moduleId: string) => void;
  onToggleModule: (moduleId: string) => void;
};

export function LearnSidebar({
  course,
  modules,
  progress,
  selectedItemId,
  expandedModules,
  onSelectItem,
  onToggleModule,
}: LearnSidebarProps) {
  const { t } = useTranslation();
  const overallProgress = progress.totalItems > 0
    ? Math.round((progress.completedItems / progress.totalItems) * 100)
    : 0;

  return (
    <aside className="hidden w-80 flex-shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="border-b border-border p-4">
        <h2 className="line-clamp-2 font-semibold">{course.title}</h2>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("learn.progress")}</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="p-2">
          {modules.map((module) => {
            const moduleProgress = progress.moduleProgress.find(
              (mp) => mp.moduleId === module.id
            );
            const isExpanded = expandedModules.has(module.id);

            return (
              <ModuleSection
                key={module.id}
                module={module}
                moduleProgress={moduleProgress}
                isExpanded={isExpanded}
                selectedItemId={selectedItemId}
                onToggle={() => onToggleModule(module.id)}
                onSelectItem={onSelectItem}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

type ModuleSectionProps = {
  module: LearnModuleLite;
  moduleProgress?: { completed: number; total: number };
  isExpanded: boolean;
  selectedItemId: string | null;
  onToggle: () => void;
  onSelectItem: (itemId: string, moduleId: string) => void;
};

function ModuleSection({
  module,
  moduleProgress,
  isExpanded,
  selectedItemId,
  onToggle,
  onSelectItem,
}: ModuleSectionProps) {
  const progressText = moduleProgress
    ? `${moduleProgress.completed}/${moduleProgress.total}`
    : `0/${module.itemsCount}`;

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left hover:bg-accent/50"
      >
        {isExpanded ? (
          <CaretDown className="size-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <CaretRight className="size-4 flex-shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <span className="line-clamp-2 text-sm font-medium">{module.title}</span>
          <span className="text-xs text-muted-foreground">{progressText}</span>
        </div>
      </button>
      {isExpanded && (
        <ModuleItems
          moduleId={module.id}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      )}
    </div>
  );
}

type ModuleItemsProps = {
  moduleId: string;
  selectedItemId: string | null;
  onSelectItem: (itemId: string, moduleId: string) => void;
};

function ModuleItems({ moduleId, selectedItemId, onSelectItem }: ModuleItemsProps) {
  const { data, isLoading } = useModuleItems(moduleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <SpinnerGap className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="ml-4 border-l border-border pl-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectItem(item.id, moduleId)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
            selectedItemId === item.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
        >
          <ItemStatusIcon status={item.status} />
          <ItemTypeIcon contentType={item.contentType} />
          <span className="line-clamp-2 flex-1">{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function ItemTypeIcon({ contentType }: { contentType: ContentType }) {
  const iconClass = "size-4 flex-shrink-0 text-muted-foreground";

  switch (contentType) {
    case "video":
      return <PlayCircle className={iconClass} />;
    case "document":
      return <FileText className={iconClass} />;
    case "quiz":
      return <ListChecks className={iconClass} />;
    default:
      return null;
  }
}

function ItemStatusIcon({ status }: { status: ItemProgressStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="size-4 flex-shrink-0 text-green-500" weight="fill" />;
    case "in_progress":
      return <Circle className="size-4 flex-shrink-0 text-primary" weight="duotone" />;
    default:
      return <Circle className="size-4 flex-shrink-0 text-muted-foreground/50" />;
  }
}
