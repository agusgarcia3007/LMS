import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { getTenantFromHost, setResolvedSlug } from "@/lib/tenant";
import { CampusService, QUERY_KEYS } from "@/services/campus/service";
import { isClient } from "@/lib/utils";

import appCss from "../index.css?url";

type RouterContext = {
  queryClient: QueryClient;
  isCampus: boolean;
  tenantSlug: string | null;
  isCustomDomain: boolean;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),

  beforeLoad: async ({ context }) => {
    if (!isClient()) {
      return { isCampus: false, tenantSlug: null, isCustomDomain: false };
    }

    const { slug, isCampus, isCustomDomain } = getTenantFromHost();

    if (isCustomDomain) {
      const hostname = window.location.hostname;
      const data = await CampusService.resolveTenant(hostname);
      setResolvedSlug(data.tenant.slug);

      context.queryClient.setQueryData(QUERY_KEYS.TENANT, data);

      return {
        isCampus: true,
        tenantSlug: data.tenant.slug,
        isCustomDomain: true,
      };
    }

    return { isCampus, tenantSlug: slug, isCustomDomain };
  },

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
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
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
