import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { setResolvedSlug } from "@/lib/tenant";
import { getTenantFromServer, fetchTenantSeo, type TenantSeoData } from "@/lib/tenant-server";
import { CampusService, QUERY_KEYS } from "@/services/campus/service";
import { createTenantSeoMeta } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getQueryClient } from "@/lib/query-client";

type RouterContext = {
  queryClient: QueryClient;
  isCampus: boolean;
  tenantSlug: string | null;
  isCustomDomain: boolean;
  hostname: string | null;
};

const defaultHead = {
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "apple-mobile-web-app-title", content: "Learnbase" },
    { name: "color-scheme", content: "dark light" },
    {
      name: "description",
      content:
        "Create and sell online courses with artificial intelligence. The all-in-one platform to launch your digital academy.",
    },
  ],
  links: [
    { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "shortcut icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
  ],
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: ({ loaderData }) => {
    const tenant = loaderData?.tenant;

    if (tenant) {
      const tenantSeo = createTenantSeoMeta(tenant);
      return {
        meta: [
          { charSet: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1.0" },
          { name: "color-scheme", content: "dark light" },
          ...tenantSeo.meta,
        ],
        links: [
          ...defaultHead.links,
          ...tenantSeo.links,
        ],
      };
    }

    return defaultHead;
  },
  beforeLoad: async ({ context }) => {
    const { slug, isCampus, isCustomDomain } = await getTenantFromServer();

    if (isCustomDomain && typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const data = await CampusService.resolveTenant(hostname);
      setResolvedSlug(data.tenant.slug);

      context.queryClient.setQueryData(QUERY_KEYS.TENANT, data);

      return {
        isCampus: true,
        tenantSlug: data.tenant.slug,
        isCustomDomain: true,
        hostname,
      };
    }

    if (isCampus && slug) {
      setResolvedSlug(slug);
    }

    return { isCampus, tenantSlug: slug, isCustomDomain, hostname: null };
  },
  loader: async ({ context }): Promise<{ tenant: TenantSeoData | null }> => {
    if (!context.isCampus || !context.tenantSlug) {
      return { tenant: null };
    }

    const tenant = await fetchTenantSeo(
      context.tenantSlug,
      context.isCustomDomain,
      context.hostname ?? undefined
    );

    return { tenant };
  },
  component: RootComponent,
});

function RootComponent() {
  const queryClient = getQueryClient();

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <ThemeScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Outlet />
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('vite-ui-theme')||'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`,
      }}
    />
  );
}
