import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ComingSoonOverlay() {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/80">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Construction className="size-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{t("common.comingSoon")}</h2>
          <p className="text-muted-foreground max-w-sm">
            {t("common.comingSoonDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
