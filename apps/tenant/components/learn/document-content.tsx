"use client";

import { useTranslation } from "react-i18next";
import { FileText, DownloadSimple, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { DocumentContent as DocumentContentType } from "@/services/learn/service";

type DocumentContentProps = {
  content: DocumentContentType;
  onComplete: () => void;
  isCompleting: boolean;
};

export function DocumentContent({ content, onComplete, isCompleting }: DocumentContentProps) {
  const { t } = useTranslation();
  const isPdf = content.mimeType?.includes("pdf");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden bg-muted/30">
        {content.url && isPdf ? (
          <iframe
            src={content.url}
            className="h-full w-full border-0"
            title={content.title}
          />
        ) : content.url ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
            <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="size-12 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{content.fileName || content.title}</h2>
              {content.mimeType && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.mimeType}
                </p>
              )}
            </div>
            <a href={content.url} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <DownloadSimple className="size-4" />
                {t("learn.document.download")}
              </Button>
            </a>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {t("learn.document.unavailable")}
          </div>
        )}
      </div>
      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="font-semibold">{content.title}</h1>
            {content.description && (
              <p className="mt-1 text-sm text-muted-foreground">{content.description}</p>
            )}
          </div>
          <Button
            onClick={onComplete}
            disabled={isCompleting}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <CheckCircle className="size-4" />
            {t("learn.markComplete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
