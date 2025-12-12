import { useTranslation } from "react-i18next";
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
    <div className="inline-flex items-center rounded-lg bg-muted/50 p-1">
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={cn(
            "relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            value === period
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t(`backoffice.dashboard.period.${period}`)}
        </button>
      ))}
    </div>
  );
}
