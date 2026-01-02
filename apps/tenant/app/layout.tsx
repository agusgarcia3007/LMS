import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

function generateGoogleFontsUrl(fonts: string[]): string | null {
  const validFonts = fonts.filter(Boolean);
  if (validFonts.length === 0) return null;

  const families = validFonts
    .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();

  if (!tenant) {
    return {
      title: "LearnBase",
      description: "Learning Management System",
    };
  }

  return {
    title: {
      default: tenant.seoTitle || tenant.name,
      template: `%s | ${tenant.name}`,
    },
    description: tenant.seoDescription || undefined,
    keywords: tenant.seoKeywords?.split(",").map((k) => k.trim()) || undefined,
    icons: tenant.favicon ? { icon: tenant.favicon } : undefined,
    openGraph: {
      title: tenant.seoTitle || tenant.name,
      description: tenant.seoDescription || undefined,
      images: tenant.logo ? [{ url: tenant.logo }] : undefined,
      siteName: tenant.name,
    },
    twitter: {
      card: "summary_large_image",
      title: tenant.seoTitle || tenant.name,
      description: tenant.seoDescription || undefined,
      images: tenant.logo ? [tenant.logo] : undefined,
    },
  };
}

function generateThemeVars(
  customTheme: Record<string, string> | null,
  mode: "light" | "dark" | "auto" | null
): React.CSSProperties {
  if (!customTheme) return {};

  const toKebab = (str: string) =>
    str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  const cssVarMap: Record<string, string> = {
    background: "--background",
    foreground: "--foreground",
    primary: "--primary",
    "primary-foreground": "--primary-foreground",
    secondary: "--secondary",
    "secondary-foreground": "--secondary-foreground",
    accent: "--accent",
    "accent-foreground": "--accent-foreground",
    muted: "--muted",
    "muted-foreground": "--muted-foreground",
    border: "--border",
    ring: "--ring",
    card: "--card",
    "card-foreground": "--card-foreground",
    popover: "--popover",
    "popover-foreground": "--popover-foreground",
    destructive: "--destructive",
    "destructive-foreground": "--destructive-foreground",
    input: "--input",
    "chart-1": "--chart-1",
    "chart-2": "--chart-2",
    "chart-3": "--chart-3",
    "chart-4": "--chart-4",
    "chart-5": "--chart-5",
    sidebar: "--sidebar",
    "sidebar-foreground": "--sidebar-foreground",
    "sidebar-primary": "--sidebar-primary",
    "sidebar-primary-foreground": "--sidebar-primary-foreground",
    "sidebar-accent": "--sidebar-accent",
    "sidebar-accent-foreground": "--sidebar-accent-foreground",
    "sidebar-border": "--sidebar-border",
    "sidebar-ring": "--sidebar-ring",
    radius: "--radius",
  };

  const isDarkMode = mode === "dark";
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(customTheme)) {
    if (!value || key.includes("shadow")) continue;

    if (key === "fontHeading") {
      vars["--font-heading"] = `"${value}", system-ui, sans-serif`;
      continue;
    }
    if (key === "fontBody") {
      vars["--font-sans"] = `"${value}", system-ui, sans-serif`;
      continue;
    }

    const isDarkVar = key.endsWith("Dark");
    const baseKey = isDarkVar ? key.slice(0, -4) : key;
    const kebabKey = toKebab(baseKey);
    const cssVar = cssVarMap[kebabKey];

    if (cssVar) {
      if (isDarkMode && isDarkVar) {
        vars[cssVar] = value;
      } else if (!isDarkMode && !isDarkVar) {
        vars[cssVar] = value;
      }
    }
  }

  return vars as React.CSSProperties;
}

function getThemeClass(mode: "light" | "dark" | "auto" | null): string {
  if (mode === "dark") return "dark";
  if (mode === "light") return "";
  return "";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenant();
  const themeVars = generateThemeVars(tenant?.customTheme ?? null, tenant?.mode ?? null);
  const themeClass = getThemeClass(tenant?.mode ?? null);

  const fontHeading = tenant?.customTheme?.fontHeading;
  const fontBody = tenant?.customTheme?.fontBody;
  const fontsUrl = generateGoogleFontsUrl([fontHeading, fontBody].filter(Boolean) as string[]);

  return (
    <html
      lang={tenant?.aiAssistantSettings?.preferredLanguage || "en"}
      className={themeClass || undefined}
      style={themeVars}
    >
      <head>
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
