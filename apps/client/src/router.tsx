import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
      isCampus: false,
      tenantSlug: null,
      isCustomDomain: false,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
    scrollRestoration: true,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TanstackQuery.Provider {...rqContext}>
            {props.children}
          </TanstackQuery.Provider>
        </ThemeProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
