import { useTranslation } from "react-i18next";
import { PanelLeftClose, PanelLeft, Menu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ModuleAccordion } from "./module-accordion";
import { useLearnLayout } from "./learn-layout-provider";
import { cn } from "@/lib/utils";
import type { LearnModule } from "@/services/learn";

type LearnSidebarProps = {
  modules: LearnModule[];
  progress: number;
  currentItemId: string | null;
  onItemSelect: (itemId: string) => void;
};

export function LearnSidebar({
  modules,
  progress,
  currentItemId,
  onItemSelect,
}: LearnSidebarProps) {
  const { t } = useTranslation();
  const { leftOpen, toggleLeft, setLeftOpenMobile } = useLearnLayout();

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <Button
          size="icon"
          onClick={() => setLeftOpenMobile(true)}
          className="size-12 rounded-full shadow-lg"
          aria-label={t("learn.openMenu")}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <aside
        className={cn(
          "bg-muted/30 relative hidden flex-col border-r transition-all duration-300 ease-in-out lg:flex",
          leftOpen ? "w-(--sidebar-width)" : "w-12"
        )}
      >
        <div
          className={cn(
            "flex flex-col transition-opacity duration-300 ease-in-out",
            leftOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="border-b p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground whitespace-nowrap text-xs font-medium uppercase tracking-wider">
                {t("learn.progress")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-semibold tabular-nums">
                  {progress}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={toggleLeft}
                  aria-label={t("learn.toggleSidebar")}
                >
                  <PanelLeftClose className="size-4" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              <ModuleAccordion
                modules={modules}
                currentItemId={currentItemId}
                onItemSelect={onItemSelect}
              />
            </div>
          </ScrollArea>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex items-start justify-center p-2 transition-opacity duration-300 ease-in-out",
            leftOpen ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLeft}
            aria-label={t("learn.toggleSidebar")}
          >
            <PanelLeft className="size-5" />
          </Button>
        </div>
      </aside>
    </>
  );
}
