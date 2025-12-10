import { useTranslation } from "react-i18next";
import { Sparkles, PanelRightClose, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useLearnLayout } from "./learn-layout-provider";
import { cn } from "@/lib/utils";

export function AIChatSidebar() {
  const { t } = useTranslation();
  const { rightOpen, toggleRight } = useLearnLayout();

  const handleSubmit = () => {
    // TODO: Implement chat submission
  };

  return (
    <>
      <aside
        className={cn(
          "bg-muted/30 hidden flex-col border-l transition-all duration-300 lg:flex",
          rightOpen ? "w-(--sidebar-width) opacity-100" : "w-0 overflow-hidden opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <span className="text-sm font-semibold">{t("learn.aiAssistant")}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleRight}
            aria-label={t("learn.closeAIChat")}
          >
            <PanelRightClose className="size-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex h-full min-h-[200px] items-center justify-center p-4">
            <p className="text-muted-foreground text-center text-sm">
              {t("learn.aiChatEmpty")}
            </p>
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder={t("learn.aiChatPlaceholder")}
              className="min-h-12"
            />
            <PromptInputFooter>
              <div />
              <PromptInputSubmit />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </aside>

      {!rightOpen && (
        <div className="hidden border-l p-2 lg:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRight}
            aria-label={t("learn.openAIChat")}
            className="text-primary"
          >
            <PanelRight className="size-5" />
          </Button>
        </div>
      )}
    </>
  );
}
