"use client";

import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type ItemNavigationProps = {
  prevItemId: string | null;
  nextItemId: string | null;
  currentIndex: number;
  totalItems: number;
  onNavigate: (itemId: string) => void;
};

export function ItemNavigation({
  prevItemId,
  nextItemId,
  currentIndex,
  totalItems,
  onNavigate,
}: ItemNavigationProps) {
  const { t } = useTranslation();

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={!prevItemId}
          onClick={() => prevItemId && onNavigate(prevItemId)}
          className="gap-2"
        >
          <CaretLeft className="size-4" />
          {t("learn.navigation.previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {totalItems}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!nextItemId}
          onClick={() => nextItemId && onNavigate(nextItemId)}
          className="gap-2"
        >
          {t("learn.navigation.next")}
          <CaretRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
