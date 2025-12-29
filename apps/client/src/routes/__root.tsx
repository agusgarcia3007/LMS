import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { isImpersonating } from "@/lib/http";
import { cn } from "@/lib/utils";

import appCss from "../index.css?url";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      { rel: "dns-prefetch", href: "https://api.dicebear.com" },
    ],
    scripts: import.meta.env.PROD
      ? [
          {
            src: "https://cloud.umami.is/script.js",
            defer: true,
            "data-website-id": "b2bbc089-d249-4f9f-a140-bc42e138b61d",
          },
        ]
      : [],
  }),

  shellComponent: RootDocument,
  component: RootComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ThemeScript />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <ImpersonationBanner />
      <div className={cn(isImpersonating() && "pt-10")}>
        <Outlet />
      </div>
    </>
  );
}

function ThemeScript() {
  const script = `
    (function() {
      try {
        const theme = localStorage.getItem('vite-ui-theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
