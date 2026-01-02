import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

function generateThemeStyles(
  customTheme: Record<string, string> | null
): string {
  if (!customTheme) return "";

  const mappings: Record<string, string> = {
    background: "--background",
    foreground: "--foreground",
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    border: "--border",
    ring: "--ring",
    card: "--card",
    cardForeground: "--card-foreground",
    popover: "--popover",
    popoverForeground: "--popover-foreground",
    destructive: "--destructive",
    input: "--input",
  };

  const lightVars: string[] = [];
  const darkVars: string[] = [];

  for (const [key, value] of Object.entries(customTheme)) {
    if (key.startsWith("dark")) {
      const baseKey = key.replace("dark", "");
      const normalizedKey =
        baseKey.charAt(0).toLowerCase() + baseKey.slice(1);
      const cssVar = mappings[normalizedKey];
      if (cssVar && value) {
        darkVars.push(`${cssVar}: ${value};`);
      }
    } else {
      const cssVar = mappings[key];
      if (cssVar && value) {
        lightVars.push(`${cssVar}: ${value};`);
      }
    }
  }

  let styles = "";
  if (lightVars.length > 0) {
    styles += `:root { ${lightVars.join(" ")} }`;
  }
  if (darkVars.length > 0) {
    styles += ` .dark { ${darkVars.join(" ")} }`;
  }

  return styles;
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
  const themeStyles = generateThemeStyles(tenant?.customTheme ?? null);
  const themeClass = getThemeClass(tenant?.mode ?? null);

  return (
    <html
      lang={tenant?.aiAssistantSettings?.preferredLanguage || "en"}
      className={`${raleway.variable} ${themeClass}`.trim()}
    >
      <head>
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
