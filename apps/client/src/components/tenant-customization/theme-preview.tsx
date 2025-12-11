import { useTranslation } from "react-i18next";
import { Sparkles, Search, Star, TrendingUp, Zap } from "lucide-react";
import type { CustomTheme } from "@/services/tenants/service";

type ThemePreviewProps = {
  theme: CustomTheme;
  mode: "light" | "dark";
  variant?: "full" | "compact";
};

export function ThemePreview({ theme, mode, variant = "full" }: ThemePreviewProps) {
  const { t } = useTranslation();

  const c = <K extends keyof CustomTheme>(lightKey: K, darkKey: K): string => {
    const value = mode === "dark" ? theme[darkKey] : theme[lightKey];
    return (value as string) || "";
  };

  if (variant === "compact") {
    return (
      <div
        className="overflow-hidden border w-[200px] shrink-0"
        style={{
          borderRadius: theme.radius,
          backgroundColor: c("background", "backgroundDark"),
          color: c("foreground", "foregroundDark"),
          fontFamily: `"${theme.fontBody || "Inter"}", ui-sans-serif, system-ui, sans-serif`,
        }}
      >
        <div
          className="px-2.5 py-1.5"
          style={{ backgroundColor: c("primary", "primaryDark") }}
        >
          <span
            className="text-[10px] font-semibold"
            style={{
              color: c("primaryForeground", "primaryForegroundDark"),
              fontFamily: `"${theme.fontHeading || "Inter"}", sans-serif`,
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewLanding")}
          </span>
        </div>

        <div className="p-2 space-y-2">
          <div className="text-center space-y-0.5">
            <h2
              className="text-[11px] font-bold leading-tight"
              style={{ fontFamily: `"${theme.fontHeading || "Inter"}", sans-serif` }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewHero")}
            </h2>
            <p
              className="text-[8px] leading-tight"
              style={{ color: c("mutedForeground", "mutedForegroundDark") }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewMuted")}
            </p>
          </div>

          <div
            className="flex items-center gap-1 px-1.5 py-1"
            style={{
              backgroundColor: c("muted", "mutedDark"),
              borderRadius: theme.radius,
            }}
          >
            <Search className="h-2.5 w-2.5" style={{ color: c("mutedForeground", "mutedForegroundDark") }} />
            <span
              className="text-[8px]"
              style={{ color: c("mutedForeground", "mutedForegroundDark") }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewInput")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[Star, TrendingUp, Zap].map((Icon, i) => (
              <div
                key={i}
                className="p-1.5 space-y-1"
                style={{
                  backgroundColor: c("card", "cardDark"),
                  borderRadius: theme.radius,
                  border: `1px solid ${c("border", "borderDark")}`,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c("primary", "primaryDark") }}
                >
                  <Icon className="h-1.5 w-1.5" style={{ color: c("primaryForeground", "primaryForegroundDark") }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              className="px-1.5 py-0.5 text-[8px] font-medium"
              style={{
                backgroundColor: c("primary", "primaryDark"),
                color: c("primaryForeground", "primaryForegroundDark"),
                borderRadius: theme.radius,
              }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewButton")}
            </button>
            <button
              className="px-1.5 py-0.5 text-[8px] font-medium"
              style={{
                backgroundColor: c("secondary", "secondaryDark"),
                color: c("secondaryForeground", "secondaryForegroundDark"),
                borderRadius: theme.radius,
              }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewOutline")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden border"
      style={{
        borderRadius: theme.radius,
        backgroundColor: c("background", "backgroundDark"),
        color: c("foreground", "foregroundDark"),
        fontFamily: `"${theme.fontBody || "Inter"}", ui-sans-serif, system-ui, sans-serif`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: c("primary", "primaryDark") }}
      >
        <span
          className="text-sm font-semibold"
          style={{
            color: c("primaryForeground", "primaryForegroundDark"),
            fontFamily: `"${theme.fontHeading || "Inter"}", sans-serif`,
          }}
        >
          {t("dashboard.site.customization.appearance.aiModal.previewLanding")}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5"
            style={{
              backgroundColor: c("accent", "accentDark"),
              color: c("accentForeground", "accentForegroundDark"),
              borderRadius: theme.radius,
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewBadge")}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center space-y-2 py-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: `"${theme.fontHeading || "Inter"}", sans-serif` }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewHero")}
          </h2>
          <p
            className="text-sm"
            style={{ color: c("mutedForeground", "mutedForegroundDark") }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewMuted")}
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            backgroundColor: c("muted", "mutedDark"),
            borderRadius: theme.radius,
          }}
        >
          <Search className="h-4 w-4" style={{ color: c("mutedForeground", "mutedForegroundDark") }} />
          <span
            className="text-sm"
            style={{ color: c("mutedForeground", "mutedForegroundDark") }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewInput")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Star, label: "previewCard1" },
            { icon: TrendingUp, label: "previewCard2" },
            { icon: Zap, label: "previewCard3" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="p-3 space-y-2"
              style={{
                backgroundColor: c("card", "cardDark"),
                borderRadius: theme.radius,
                border: `1px solid ${c("border", "borderDark")}`,
                boxShadow: c("shadow", "shadowDark"),
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: c("primary", "primaryDark") }}
              >
                <Icon className="h-3 w-3" style={{ color: c("primaryForeground", "primaryForegroundDark") }} />
              </div>
              <p
                className="text-xs font-medium"
                style={{
                  color: c("cardForeground", "cardForegroundDark"),
                  fontFamily: `"${theme.fontHeading || "Inter"}", sans-serif`,
                }}
              >
                {t(`dashboard.site.customization.appearance.aiModal.${label}`)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: c("primary", "primaryDark"),
              color: c("primaryForeground", "primaryForegroundDark"),
              borderRadius: theme.radius,
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewButton")}
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: c("secondary", "secondaryDark"),
              color: c("secondaryForeground", "secondaryForegroundDark"),
              borderRadius: theme.radius,
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewOutline")}
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: c("destructive", "destructiveDark"),
              color: c("destructiveForeground", "destructiveForegroundDark"),
              borderRadius: theme.radius,
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewDestructive")}
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium border"
            style={{
              borderColor: c("border", "borderDark"),
              color: c("foreground", "foregroundDark"),
              borderRadius: theme.radius,
              backgroundColor: "transparent",
            }}
          >
            {t("dashboard.site.customization.appearance.aiModal.previewGhost")}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: c("mutedForeground", "mutedForegroundDark") }}>
            {t("dashboard.site.customization.appearance.aiModal.previewCharts")}
          </p>
          <div className="flex items-end gap-1 h-10">
            <div
              className="flex-1 rounded-t"
              style={{ backgroundColor: c("chart1", "chart1Dark"), height: "80%" }}
            />
            <div
              className="flex-1 rounded-t"
              style={{ backgroundColor: c("chart2", "chart2Dark"), height: "60%" }}
            />
            <div
              className="flex-1 rounded-t"
              style={{ backgroundColor: c("chart3", "chart3Dark"), height: "90%" }}
            />
            <div
              className="flex-1 rounded-t"
              style={{ backgroundColor: c("chart4", "chart4Dark"), height: "45%" }}
            />
            <div
              className="flex-1 rounded-t"
              style={{ backgroundColor: c("chart5", "chart5Dark"), height: "70%" }}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-3 p-3 mt-2"
          style={{
            backgroundColor: c("sidebar", "sidebarDark"),
            borderRadius: theme.radius,
            border: `1px solid ${c("sidebarBorder", "sidebarBorderDark")}`,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: c("sidebarPrimary", "sidebarPrimaryDark") }}
          >
            <Sparkles
              className="h-4 w-4"
              style={{ color: c("sidebarPrimaryForeground", "sidebarPrimaryForegroundDark") }}
            />
          </div>
          <div className="flex-1">
            <p
              className="text-xs font-medium"
              style={{ color: c("sidebarForeground", "sidebarForegroundDark") }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewSidebar")}
            </p>
            <p
              className="text-xs"
              style={{ color: c("sidebarAccentForeground", "sidebarAccentForegroundDark") }}
            >
              {t("dashboard.site.customization.appearance.aiModal.previewSidebarSub")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
