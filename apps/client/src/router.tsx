import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getQueryClient } from "./lib/query-client";

export function getRouter() {
  const queryClient = getQueryClient();

  return createRouter({
    routeTree,
    context: {
      queryClient,
      isCampus: false,
      tenantSlug: null,
      isCustomDomain: false,
      hostname: null,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
