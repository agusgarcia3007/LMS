"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SpinnerGap } from "@phosphor-icons/react";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { ContentViewer } from "@/components/learn/content-viewer";
import { ItemNavigation } from "@/components/learn/item-navigation";
import { useCourseStructure, useCourseProgress } from "@/services/learn";
import { getAccessToken } from "@/lib/http";

type CoursePlayerContentProps = {
  courseSlug: string;
};

export function CoursePlayerContent({ courseSlug }: CoursePlayerContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: structure, isLoading: structureLoading } = useCourseStructure(courseSlug);
  const { data: progress, isLoading: progressLoading } = useCourseProgress(courseSlug);

  useEffect(() => {
    if (typeof window !== "undefined" && !getAccessToken()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (structure && !selectedItemId) {
      if (structure.resumeItemId) {
        setSelectedItemId(structure.resumeItemId);
        const item = progress?.itemIds.find((i) => i.id === structure.resumeItemId);
        if (item) {
          setExpandedModules(new Set([item.moduleId]));
        }
      } else if (progress?.itemIds.length) {
        const firstItem = progress.itemIds[0];
        setSelectedItemId(firstItem.id);
        setExpandedModules(new Set([firstItem.moduleId]));
      }
    }
  }, [structure, progress, selectedItemId]);

  const currentItemIndex = useMemo(() => {
    if (!progress?.itemIds || !selectedItemId) return -1;
    return progress.itemIds.findIndex((i) => i.id === selectedItemId);
  }, [progress?.itemIds, selectedItemId]);

  const prevItemId = currentItemIndex > 0 ? progress?.itemIds[currentItemIndex - 1]?.id ?? null : null;
  const nextItemId = progress?.itemIds && currentItemIndex < progress.itemIds.length - 1
    ? progress.itemIds[currentItemIndex + 1]?.id ?? null
    : null;

  const handleSelectItem = (itemId: string, moduleId: string) => {
    setSelectedItemId(itemId);
    setExpandedModules((prev) => new Set([...prev, moduleId]));
  };

  const handleToggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleNavigate = (itemId: string) => {
    const item = progress?.itemIds.find((i) => i.id === itemId);
    if (item) {
      handleSelectItem(itemId, item.moduleId);
    }
  };

  const isLoading = structureLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpinnerGap className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("learn.loading")}</p>
        </div>
      </div>
    );
  }

  if (!structure || !progress) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t("learn.notFound.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("learn.notFound.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <LearnSidebar
        course={structure.course}
        modules={structure.modules}
        progress={progress}
        selectedItemId={selectedItemId}
        expandedModules={expandedModules}
        onSelectItem={handleSelectItem}
        onToggleModule={handleToggleModule}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {selectedItemId && (
            <ContentViewer
              itemId={selectedItemId}
              courseSlug={courseSlug}
            />
          )}
        </div>
        <ItemNavigation
          prevItemId={prevItemId}
          nextItemId={nextItemId}
          currentIndex={currentItemIndex}
          totalItems={progress.totalItems}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
