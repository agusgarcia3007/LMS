"use client";

import { useTranslation } from "react-i18next";
import { Wrench } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

type PagePlaceholderProps = {
  titleKey: string;
  descriptionKey?: string;
};

export function PagePlaceholder({ titleKey, descriptionKey }: PagePlaceholderProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t(titleKey)}</h1>
        {descriptionKey && (
          <p className="text-muted-foreground">{t(descriptionKey)}</p>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4">
            <Wrench className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("common.comingSoon")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("common.featureInDevelopment")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
