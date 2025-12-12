import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { TrendPeriod } from "@/services/dashboard";
import { cn } from "@/lib/utils";

type PeriodSelectorProps = {
  value: TrendPeriod;
  onChange: (period: TrendPeriod) => void;
};

const periods: TrendPeriod[] = ["7d", "30d", "90d"];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {periods.map((period) => (
        <Button
          key={period}
          variant="ghost"
          size="sm"
          onClick={() => onChange(period)}
          className={cn(
            "h-7 px-3 text-xs",
            value === period && "bg-background shadow-sm"
          )}
        >
          {t(`backoffice.dashboard.period.${period}`)}
        </Button>
      ))}
    </div>
  );
}
