import { useTranslation } from "react-i18next";
import { Sparkles, PanelRightClose } from "lucide-react";
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
    <aside
      className={cn(
        "bg-muted/30 relative hidden flex-col border-l transition-all duration-300 ease-in-out lg:flex",
        rightOpen ? "w-(--sidebar-width)" : "w-12"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col transition-opacity duration-300 ease-in-out",
          rightOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <span className="whitespace-nowrap text-sm font-semibold">
              {t("learn.aiAssistant")}
            </span>
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
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-start justify-center p-2 transition-opacity duration-300 ease-in-out",
          rightOpen ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRight}
          aria-label={t("learn.openAIChat")}
          className="text-primary"
        >
          <Sparkles className="size-5" />
        </Button>
      </div>
    </aside>
  );
}
