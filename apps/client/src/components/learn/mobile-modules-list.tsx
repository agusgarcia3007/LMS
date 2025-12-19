import { useTranslation } from "react-i18next";
import { List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModuleAccordion } from "./module-accordion";
import type { LearnModuleLite, ModuleProgressData } from "@/services/learn";

type MobileModulesListProps = {
  modules: LearnModuleLite[];
  moduleProgress: Map<string, ModuleProgressData>;
  currentItemId: string | null;
  currentModuleId: string | null;
  onItemSelect: (itemId: string) => void;
  courseSlug: string;
};

export function MobileModulesList({
  modules,
  moduleProgress,
  currentItemId,
  currentModuleId,
  onItemSelect,
  courseSlug,
}: MobileModulesListProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="mt-2 border-t pt-3">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wide">
        <List className="size-3.5" />
        {t("learn.courseContent")}
      </div>
      <ModuleAccordion
        modules={modules}
        moduleProgress={moduleProgress}
        currentItemId={currentItemId}
        currentModuleId={currentModuleId}
        onItemSelect={onItemSelect}
        courseSlug={courseSlug}
      />
    </div>
  );
}
