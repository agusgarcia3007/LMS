import { useEffect } from "react";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { routeTree } from "./routeTree.gen";
import { ErrorBoundary, NotFoundBoundary } from "@/components/error";
import { detectAndSetLanguage } from "./i18n";

function AppWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    detectAndSetLanguage();
  }, []);

  return <>{children}</>;
}

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: rqContext,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
    scrollRestoration: true,
    defaultErrorComponent: ErrorBoundary,
    defaultNotFoundComponent: NotFoundBoundary,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TanstackQuery.Provider {...rqContext}>
            <AppWrapper>{props.children}</AppWrapper>
          </TanstackQuery.Provider>
        </ThemeProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
