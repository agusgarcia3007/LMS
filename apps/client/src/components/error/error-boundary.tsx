import type { ErrorComponentProps } from "@tanstack/react-router";
import { TenantErrorPage } from "./tenant-error";
import { PlatformErrorPage } from "./platform-error";

const PLATFORM_ROUTES = [
  "/backoffice",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/profile",
  "/create-tenant",
];

function isPlatformRoute(pathname: string): boolean {
  return PLATFORM_ROUTES.some((route) => pathname.startsWith(route));
}

export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isDev = import.meta.env.DEV;

  if (isPlatformRoute(pathname)) {
    return (
      <PlatformErrorPage
        error={error}
        reset={reset}
        showDetails={isDev}
      />
    );
  }

  return (
    <TenantErrorPage
      error={error}
      reset={reset}
      showDetails={isDev}
    />
  );
}

export function NotFoundBoundary() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isDev = import.meta.env.DEV;
  const notFoundError = new Error("Page not found");

  if (isPlatformRoute(pathname)) {
    return (
      <PlatformErrorPage
        error={notFoundError}
        showDetails={isDev}
        isNotFound
      />
    );
  }

  return (
    <TenantErrorPage
      error={notFoundError}
      showDetails={isDev}
      isNotFound
    />
  );
}
