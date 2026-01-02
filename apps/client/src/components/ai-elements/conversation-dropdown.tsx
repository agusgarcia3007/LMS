import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, MessageSquare, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useConversationsList,
  type Conversation,
  type ConversationType,
} from "@/services/conversations";

type ConversationDropdownProps = {
  type: ConversationType;
  currentConversationId?: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  triggerClassName?: string;
};

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
      )}
    >
      <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {conversation.title || conversation.metadata?.courseTitle || "..."}
        </p>
        {conversation.lastMessageAt && (
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(conversation.lastMessageAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 px-3 py-2">
          <Skeleton className="size-4 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onNewConversation }: { onNewConversation: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <History className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {t("conversations.empty.title")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("conversations.empty.description")}
        </p>
      </div>
      <Button size="sm" onClick={onNewConversation}>
        <Plus className="mr-1.5 size-3.5" />
        {t("conversations.newConversation")}
      </Button>
    </div>
  );
}

export function ConversationDropdown({
  type,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  triggerClassName,
}: ConversationDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useConversationsList(
    { type, limit: 5 },
    { enabled: open || !!currentConversationId }
  );

  const currentConversation = currentConversationId
    ? data?.conversations.find((c) => c.id === currentConversationId)
    : null;

  const currentTitle = currentConversation?.title
    || currentConversation?.metadata?.courseTitle
    || null;

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setOpen(false);
  };

  const handleNewConversation = () => {
    onNewConversation();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 max-w-[180px]", triggerClassName)}
        >
          <History className="size-4 shrink-0" />
          {currentTitle && (
            <span className="truncate text-xs">{currentTitle}</span>
          )}
          <ChevronDown className="size-3 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-medium">{t("conversations.title")}</h4>
          <Button size="xs" variant="ghost" onClick={handleNewConversation}>
            <Plus className="mr-1 size-3" />
            {t("conversations.new")}
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !data?.conversations.length ? (
            <EmptyState onNewConversation={handleNewConversation} />
          ) : (
            <div className="space-y-0.5 p-2">
              {data.conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === currentConversationId}
                  onClick={() => handleSelect(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
