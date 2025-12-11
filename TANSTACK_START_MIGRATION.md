# Migración a TanStack Start - Análisis de Dependencias de Cliente

## Resumen Ejecutivo

Este documento identifica todos los puntos en el cliente actual (React + Vite SPA) donde hay lógica dependiente del navegador que necesitará ser adaptada para la migración a TanStack Start (SSR/fullstack).

---

## 1. Evaluación de Tokens en beforeLoad

### 1.1 `/$tenantSlug/route.tsx` (Dashboard del Tenant)
**Archivo:** `apps/client/src/routes/$tenantSlug/route.tsx:14-55`

```typescript
beforeLoad: async ({ context, params }) => {
  setResolvedSlug(params.tenantSlug);

  if (typeof window === "undefined") {
    return {};  // SSR bypass actual
  }

  const { queryClient } = context;

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw redirect({ to: "/login" });
  }

  const [profileData, tenantData] = await Promise.all([
    queryClient.ensureQueryData(profileOptions()),
    queryClient.ensureQueryData(tenantOptions(params.tenantSlug)),
  ]);

  // Validaciones de rol y tenant...
}
```

**Puntos críticos:**
- `localStorage.getItem("accessToken")` - Token check
- `queryClient.ensureQueryData()` - Data fetching en cliente
- Validaciones de rol: `user.role !== "owner" && user.role !== "superadmin"`
- Validación de propiedad: `user.tenantId !== tenant.id`

---

### 1.2 `/my-courses/route.tsx` (Rutas de Estudiante)
**Archivo:** `apps/client/src/routes/my-courses/route.tsx:4-10`

```typescript
beforeLoad: () => {
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}
```

**Puntos críticos:**
- `typeof window !== "undefined"` - Guard de SSR
- `localStorage.getItem("accessToken")` - Token check

---

### 1.3 `/backoffice/route.tsx` (Admin Global)
**Archivo:** `apps/client/src/routes/backoffice/route.tsx:8-34`

```typescript
beforeLoad: async ({ context }) => {
  if (typeof window === "undefined") {
    return {};
  }

  const { queryClient } = context;

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw redirect({ to: "/login" });
  }

  const profileData = await queryClient.ensureQueryData(profileOptions());

  if (!profileData?.user) {
    throw redirect({ to: "/login" });
  }

  const { user } = profileData;

  if (user.role !== "superadmin") {
    throw redirect({ to: "/" });
  }

  return { user };
}
```

**Puntos críticos:**
- `typeof window === "undefined"` - Guard de SSR
- `localStorage.getItem("accessToken")` - Token check
- Validación de rol: `user.role !== "superadmin"`

---

### 1.4 `/create-tenant.tsx` (Onboarding de Owner)
**Archivo:** `apps/client/src/routes/create-tenant.tsx:36-57`

```typescript
beforeLoad: async ({ context }) => {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw redirect({ to: "/login" });
  }

  const data = await context.queryClient.ensureQueryData(profileOptions());

  if (!data?.user) {
    throw redirect({ to: "/login" });
  }

  if (data.user.role !== "owner" || data.user.tenantId !== null) {
    throw redirect({ to: "/" });
  }

  return { user: data.user };
}
```

**Puntos críticos:**
- `typeof window === "undefined"` - Guard de SSR
- `localStorage.getItem("accessToken")` - Token check
- Validación business logic: `user.role !== "owner" || user.tenantId !== null`

---

### 1.5 `/__root.tsx` (Root Route)
**Archivo:** `apps/client/src/routes/__root.tsx:17-36`

```typescript
beforeLoad: async ({ context }) => {
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
}
```

**Puntos críticos:**
- `getTenantFromHost()` - Accede a `window.location`
- `window.location.hostname` - Hostname para custom domains
- `CampusService.resolveTenant()` - API call desde cliente

---

### 1.6 `/courses.tsx` (Layout de Campus)
**Archivo:** `apps/client/src/routes/courses.tsx:3-8`

```typescript
beforeLoad: ({ context }) => {
  if (!context.isCampus) {
    throw redirect({ to: "/" });
  }
}
```

**Puntos críticos:**
- Usa contexto de router (OK para SSR)
- No accede a browser APIs directamente

---

## 2. Loaders con Data Fetching

### 2.1 `/courses/$courseSlug.tsx`
**Archivo:** `apps/client/src/routes/courses/$courseSlug.tsx:27-34`

```typescript
loader: async ({ params }) => {
  try {
    const data = await CampusService.getCourse(params.courseSlug);
    return { course: data.course };
  } catch {
    return { course: null };
  }
}
```

**Puntos críticos:**
- `CampusService.getCourse()` usa `http` (axios) que tiene interceptores con `localStorage`

---

### 2.2 `/my-courses/$courseSlug.tsx`
**Archivo:** `apps/client/src/routes/my-courses/$courseSlug.tsx:44-51`

```typescript
loader: async ({ params }) => {
  try {
    const data = await LearnService.getCourseStructure(params.courseSlug);
    return { course: data.course };
  } catch {
    return { course: null };
  }
}
```

**Puntos críticos:**
- `LearnService.getCourseStructure()` usa `http` que accede a `localStorage` para tokens

---

## 3. HTTP Client y Tokens

### 3.1 `lib/http.ts` - Configuración de Axios
**Archivo:** `apps/client/src/lib/http.ts`

#### Storage Keys (líneas 6-8):
```typescript
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REDIRECT_PATH_KEY = "redirectPath";
```

#### Request Interceptor (líneas 17-34):
```typescript
http.interceptors.request.use((config) => {
  if (!isClient()) {
    return config;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const { slug } = getTenantFromHost();
  const tenantSlug = slug || getResolvedSlug();
  if (tenantSlug) {
    config.headers["X-Tenant-Slug"] = tenantSlug;
  }

  return config;
});
```

#### Response Interceptor - Refresh Token (líneas 36-73):
```typescript
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      // Lógica de refresh con localStorage
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      // Redirect a /login si falla
      sessionStorage.setItem(REDIRECT_PATH_KEY, currentPath);
      window.location.href = "/login";
    }
  }
);
```

#### Funciones de Token (líneas 76-90):
```typescript
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getRedirectPath = () => sessionStorage.getItem(REDIRECT_PATH_KEY);
export const clearRedirectPath = () => sessionStorage.removeItem(REDIRECT_PATH_KEY);
```

#### Token Validation (líneas 92-128):
```typescript
export async function ensureValidToken(): Promise<string | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  // Decodifica JWT y verifica expiración
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiresAt = payload.exp * 1000;
  // ...refresh si está por expirar
}
```

---

## 4. Detección de Tenant (Multi-tenant)

### 4.1 `lib/tenant.ts`
**Archivo:** `apps/client/src/lib/tenant.ts`

#### Variables globales (líneas 8-10):
```typescript
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "learnbase.lat";
let resolvedCustomDomainSlug: string | null = null;
```

#### getTenantFromHost (líneas 24-48):
```typescript
export function getTenantFromHost(): TenantInfo {
  if (import.meta.env.DEV) {
    const url = new URL(window.location.href);
    const campusSlug = url.searchParams.get("campus");
    // ...
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { slug: null, isCampus: false, isCustomDomain: false };
  }

  if (isOurDomain(hostname)) {
    const parts = hostname.split(".");
    // Detecta subdominios
  }

  return { slug: null, isCampus: true, isCustomDomain: true };
}
```

#### URL Helpers (líneas 50-73):
```typescript
export function getCampusUrl(slug: string, customDomain?: string | null): string {
  const { protocol } = window.location;
  // ...
}

export function getMainDomainUrl(): string {
  const { protocol } = window.location;
  const hostname = window.location.hostname;
  // ...
}
```

---

## 5. Query Options con Dependencias de Cliente

### 5.1 `services/profile/options.ts`
**Archivo:** `apps/client/src/services/profile/options.ts:12-18`

```typescript
export const profileOptions = () =>
  queryOptions({
    queryFn: ProfileService.get,
    queryKey: QUERY_KEYS.PROFILE,
    enabled: isClient() && !!localStorage.getItem("accessToken"),
    retry: false,
  });
```

**Puntos críticos:**
- `isClient()` - Guard de SSR
- `localStorage.getItem("accessToken")` - Condición de enabled

---

## 6. Entry Point y Providers

### 6.1 `main.tsx`
**Archivo:** `apps/client/src/main.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 10 },
    mutations: { onError: catchAxiosError },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    isCampus: false,
    tenantSlug: null,
    isCustomDomain: false,
  },
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 0,
  defaultPendingMinMs: 0,
  scrollRestoration: true,
});

// Render...
ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </QueryClientProvider>
);
```

---

## 7. Helpers de Utilidad

### 7.1 `lib/utils.ts`
**Archivo:** `apps/client/src/lib/utils.ts:11`

```typescript
export const isClient = () => typeof window !== "undefined";
```

---

## 8. Resumen de Browser APIs Utilizadas

| API | Archivo | Uso |
|-----|---------|-----|
| `localStorage.getItem("accessToken")` | http.ts, rutas | Token de autenticación |
| `localStorage.getItem("refreshToken")` | http.ts | Refresh token |
| `localStorage.setItem()` | http.ts | Guardar tokens |
| `localStorage.removeItem()` | http.ts | Logout |
| `sessionStorage.getItem("redirectPath")` | http.ts | Ruta post-login |
| `sessionStorage.setItem()` | http.ts | Guardar redirect |
| `window.location.hostname` | tenant.ts, __root.tsx | Detección de tenant |
| `window.location.href` | http.ts, tenant.ts | Redirects, URL parsing |
| `window.location.pathname` | http.ts | Guardar ruta actual |
| `window.location.protocol` | tenant.ts | Construir URLs |
| `import.meta.env.DEV` | tenant.ts | Modo desarrollo |
| `import.meta.env.VITE_*` | http.ts, tenant.ts | Variables de entorno |

---

## 9. Archivos a Modificar para Migración

### Alta Prioridad (Core Auth/Routing):
1. `apps/client/src/lib/http.ts` - Migrar a cookies HTTP-only
2. `apps/client/src/lib/tenant.ts` - Migrar a headers de request
3. `apps/client/src/routes/__root.tsx` - Usar server-side tenant detection
4. `apps/client/src/routes/$tenantSlug/route.tsx` - Server-side auth check
5. `apps/client/src/routes/backoffice/route.tsx` - Server-side auth check
6. `apps/client/src/routes/my-courses/route.tsx` - Server-side auth check
7. `apps/client/src/routes/create-tenant.tsx` - Server-side auth check
8. `apps/client/src/services/profile/options.ts` - Remover client check
9. `apps/client/src/main.tsx` - Migrar a TanStack Start entry

### Media Prioridad (Loaders):
10. `apps/client/src/routes/courses/$courseSlug.tsx` - Usar server loader
11. `apps/client/src/routes/my-courses/$courseSlug.tsx` - Usar server loader

### Baja Prioridad (UI Helpers):
12. `apps/client/src/lib/utils.ts` - Evaluar si `isClient()` sigue siendo necesario

---

## 10. Consideraciones para TanStack Start

### Autenticación:
- **Actual:** JWT en localStorage con refresh automático
- **Propuesto:** Cookies HTTP-only con middleware de servidor

### Tenant Detection:
- **Actual:** `window.location.hostname` en cliente
- **Propuesto:** Headers de request en servidor (`Host`, `X-Forwarded-Host`)

### Data Fetching:
- **Actual:** `queryClient.ensureQueryData()` en beforeLoad (cliente)
- **Propuesto:** Server functions con acceso directo a DB o API interna

### Redirects:
- **Actual:** `throw redirect()` con guards de `typeof window`
- **Propuesto:** Server-side redirects nativos de TanStack Start
