"use client";

import { useTranslation } from "react-i18next";
import { SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { VideoContent } from "./video-content";
import { DocumentContent } from "./document-content";
import { QuizContent } from "./quiz-content";
import { useItemContent, useCompleteItem } from "@/services/learn";
import type { ItemContent as ItemContentType } from "@/services/learn/service";

type ContentViewerProps = {
  itemId: string;
  courseSlug: string;
};

export function ContentViewer({ itemId, courseSlug }: ContentViewerProps) {
  const { t } = useTranslation();
  const { data: content, isLoading, isError } = useItemContent(itemId);
  const { mutate: completeItem, isPending: isCompleting } = useCompleteItem(courseSlug);

  const handleComplete = () => {
    completeItem(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpinnerGap className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("learn.loadingContent")}</p>
        </div>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <WarningCircle className="size-12 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">{t("learn.contentError.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("learn.contentError.description")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ContentRenderer
        content={content}
        onComplete={handleComplete}
        isCompleting={isCompleting}
      />
    </div>
  );
}

type ContentRendererProps = {
  content: ItemContentType;
  onComplete: () => void;
  isCompleting: boolean;
};

function ContentRenderer({ content, onComplete, isCompleting }: ContentRendererProps) {
  switch (content.type) {
    case "video":
      return (
        <VideoContent
          content={content}
          onComplete={onComplete}
          isCompleting={isCompleting}
        />
      );
    case "document":
      return (
        <DocumentContent
          content={content}
          onComplete={onComplete}
          isCompleting={isCompleting}
        />
      );
    case "quiz":
      return (
        <QuizContent
          content={content}
          onComplete={onComplete}
          isCompleting={isCompleting}
        />
      );
    default:
      return null;
  }
}
