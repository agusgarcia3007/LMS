# LMS Monorepo

## Structure

```
apps/
├── client/   # React + Vite + Tailwind v4 + shadcn/ui
└── server/   # Elysia + Bun + Drizzle + PostgreSQL
```

## Commands

### Client (`apps/client`)
- **Dev**: `bun run dev` - Start development server
- **Build**: `bun run build` - Build for production (also type checks)
- **Lint**: `bun run lint` - Run ESLint
- **Preview**: `bun run preview` - Preview production build

### Server (`apps/server`)
- **Dev**: `bun run dev` - Start with hot reload
- **Start**: `bun run start` - Start production server
- **DB Generate**: `bun run db:generate` - Generate Drizzle migrations
- **DB Migrate**: `bun run db:migrate` - Run migrations
- **DB Push**: `bun run db:push` - Push schema directly
- **DB Studio**: `bun run db:studio` - Open Drizzle Studio

Note: No direct `tsc` - use IDE diagnostics or `bun run build` for type checking

## Multi-Tenant

- Subdomain per tenant: `tenant1.domain.com`
- Users isolated by tenant, superadmin has global access
- Dev: use `X-Tenant-Slug` header

## Code Style

- No emojis, no `any`, no comments, minimal `try/catch`
- Clear names over comments
- Small composable components, avoid `useEffect`

## Client (React)

### i18n

All UI text must be translated using `useTranslation`:
- Translations in `apps/client/src/locales/{en,es,pt}.json`
- Use `t("key")` or `t("key", { param })` for interpolation

### TanStack Query

- Global error handler (`catchAxiosError`) - no try/catch needed
- `const { mutate, isPending } = useMyMutation()`
- `const { data, isLoading } = useMyQuery()`

### Services Structure

```
services/[resource]/
├── service.ts    # Types, QUERY_KEYS, HTTP calls
├── options.ts    # queryOptions, mutationOptions
├── queries.ts    # useQuery hooks
└── mutations.ts  # useMutation hooks
```

### Button Component

- `isLoading` prop shows spinner (hides children on mobile)

### File Uploads

All file uploads must use the dropzone pattern with `useFileUpload` hook:
- Use existing components: `ImageUpload`, `VideoUpload`, `AvatarUpload` from `@/components/file-upload/`
- Never use URL input fields for file uploads
- Files are uploaded as base64 to dedicated `POST /:id/<resource>` endpoints
- S3 keys are stored in database, presigned URLs generated on-demand

## Server (Elysia)

### Route Structure

Routes are defined in `apps/server/src/routes/` and registered in `routes/index.ts`:

```typescript
// routes/index.ts
export const ROUTES = [
  { path: "/courses", name: "courses-routes", route: coursesRoutes },
  { path: "/users", name: "users-routes", route: usersRoutes },
];
```

### Creating a New Route File

```typescript
import { Elysia, t } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { guardPlugin } from "@/plugins/guards";
import { AppError, ErrorCode } from "@/lib/errors";

export const myRoutes = new Elysia()
  .use(authPlugin)
  .use(guardPlugin)
  .get("/", async (ctx) => {
    // Handler code here
    return { data: [] };
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
    detail: {
      tags: ["MyResource"],
      summary: "List resources",
    },
    requireAuth: true,
    requireTenant: true,
  });
```

### Plugins

| Plugin | Purpose | Provides |
|--------|---------|----------|
| `authPlugin` | JWT authentication | `ctx.user`, `ctx.userId`, `ctx.userRole` |
| `tenantPlugin` | Multi-tenant resolution | `ctx.tenant` |
| `guardPlugin` | Route-level authorization macros | `requireAuth`, `requireTenant`, `requireRole` |

### Guard Macros

Use in route options to enforce authorization:

```typescript
.get("/", handler, {
  requireAuth: true,                              // User must be logged in
  requireTenant: true,                            // User must have tenantId
  requireRole: ["owner", "admin", "superadmin"],  // User must have one of these roles
})
```

### Error Handling

Throw `AppError` for expected errors - global handler catches them:

```typescript
import { AppError, ErrorCode } from "@/lib/errors";

// In route handler
if (!ctx.user) {
  throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
}

if (!resource) {
  throw new AppError(ErrorCode.NOT_FOUND, "Resource not found", 404);
}
```

Common error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `TENANT_NOT_FOUND`

### Cache Invalidation

When modifying tenant data, always invalidate cache:

```typescript
import { invalidateTenantCache } from "@/plugins/tenant";

// After updating tenant
await db.update(tenantsTable).set({ ... }).where(eq(tenantsTable.id, tenantId));
invalidateTenantCache(tenant.slug);
```

### Request Validation

Use TypeBox schemas in route options:

```typescript
.post("/", handler, {
  body: t.Object({
    name: t.String({ minLength: 1 }),
    email: t.String({ format: "email" }),
    status: t.Optional(t.Union([t.Literal("active"), t.Literal("inactive")])),
  }),
  params: t.Object({
    id: t.String({ format: "uuid" }),
  }),
})
```

### Database

Add indexes on filter columns (foreign keys, WHERE clauses):

```typescript
export const usersTable = pgTable("users", {
  tenantId: uuid("tenant_id").references(() => tenantsTable.id),
  role: userRoleEnum("role").notNull(),
}, (table) => [
  index("users_tenant_id_idx").on(table.tenantId),
  index("users_role_idx").on(table.role),
]);
```

### Filters

Use `parseListParams` and `buildWhereClause` from `@/lib/filters`:

| Type | URL | Behavior |
|------|-----|----------|
| Single | `role=admin` | `eq()` |
| Multiple | `role=admin,owner` | `inArray()` |
| Date range | `createdAt=2025-01-01,2025-01-31` | `gte() AND lte()` |
| Search | `search=john` | `ilike()` on searchable fields |

### List Endpoint Pattern

```typescript
import { parseListParams, buildWhereClause, getSortColumn, getPaginationParams, calculatePagination } from "@/lib/filters";

const fieldMap: FieldMap = { status: resourcesTable.status, createdAt: resourcesTable.createdAt };
const searchableFields = [resourcesTable.name, resourcesTable.description];
const dateFields: DateFields = new Set(["createdAt"]);

.get("/", async (ctx) => {
  const params = parseListParams(ctx.query);
  const baseWhere = buildWhereClause(params, fieldMap, searchableFields, dateFields);
  const tenantFilter = eq(resourcesTable.tenantId, ctx.user!.tenantId!);
  const whereClause = baseWhere ? and(baseWhere, tenantFilter) : tenantFilter;

  const sortColumn = getSortColumn(params.sort, fieldMap, { field: "createdAt", order: "desc" });
  const { limit, offset } = getPaginationParams(params.page, params.limit);

  const [data, [{ count: total }]] = await Promise.all([
    db.select().from(resourcesTable).where(whereClause).orderBy(sortColumn).limit(limit).offset(offset),
    db.select({ count: count() }).from(resourcesTable).where(whereClause),
  ]);

  return { resources: data, pagination: calculatePagination(total, params.page, params.limit) };
})
```

### Complete CRUD Example

```typescript
export const resourcesRoutes = new Elysia()
  .use(authPlugin)
  .use(guardPlugin)
  // LIST
  .get("/", async (ctx) => {
    const resources = await db.select().from(resourcesTable)
      .where(eq(resourcesTable.tenantId, ctx.user!.tenantId!));
    return { resources };
  }, { requireAuth: true, requireTenant: true })
  // GET BY ID
  .get("/:id", async (ctx) => {
    const [resource] = await db.select().from(resourcesTable)
      .where(and(
        eq(resourcesTable.id, ctx.params.id),
        eq(resourcesTable.tenantId, ctx.user!.tenantId!)
      ));
    if (!resource) throw new AppError(ErrorCode.NOT_FOUND, "Resource not found", 404);
    return { resource };
  }, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    requireAuth: true, requireTenant: true,
  })
  // CREATE
  .post("/", async (ctx) => {
    const [resource] = await db.insert(resourcesTable)
      .values({ ...ctx.body, tenantId: ctx.user!.tenantId! })
      .returning();
    return { resource };
  }, {
    body: t.Object({ name: t.String({ minLength: 1 }) }),
    requireAuth: true, requireTenant: true, requireRole: ["owner", "admin"],
  })
  // UPDATE
  .put("/:id", async (ctx) => {
    const [resource] = await db.update(resourcesTable)
      .set(ctx.body)
      .where(and(
        eq(resourcesTable.id, ctx.params.id),
        eq(resourcesTable.tenantId, ctx.user!.tenantId!)
      ))
      .returning();
    if (!resource) throw new AppError(ErrorCode.NOT_FOUND, "Resource not found", 404);
    return { resource };
  }, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    body: t.Object({ name: t.Optional(t.String({ minLength: 1 })) }),
    requireAuth: true, requireTenant: true, requireRole: ["owner", "admin"],
  })
  // DELETE
  .delete("/:id", async (ctx) => {
    const [deleted] = await db.delete(resourcesTable)
      .where(and(
        eq(resourcesTable.id, ctx.params.id),
        eq(resourcesTable.tenantId, ctx.user!.tenantId!)
      ))
      .returning();
    if (!deleted) throw new AppError(ErrorCode.NOT_FOUND, "Resource not found", 404);
    return { success: true };
  }, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    requireAuth: true, requireTenant: true, requireRole: ["owner", "admin"],
  });
```

## AI Prompts Security

Never inject user input directly into prompts. Always use:
- Predefined enum values for style/type parameters
- Structured data passed as separate variables
- Whitelist validation for any text that goes into prompts

```typescript
// BAD - prompt injection vulnerability
const prompt = `Generate image with style: ${userInput}`;

// GOOD - use enum values only
const ALLOWED_STYLES = ["minimal", "professional", "colorful"] as const;
const style = ALLOWED_STYLES.includes(input) ? input : "default";
```

## AI Video Analysis

Generates title and description from video content using FFmpeg and Groq.

### Flow

```
Video (S3) → FFmpeg (2x speed audio) → Groq Whisper → Groq Llama 70b → { title, description }
```

### Components

| File | Purpose |
|------|---------|
| `lib/ai/transcript.ts` | FFmpeg + Groq Whisper transcription |
| `lib/ai/groq.ts` | Groq SDK client |
| `lib/ai/models.ts` | Model IDs (whisper-large-v3-turbo, llama-3.3-70b-versatile) |
| `lib/ai/prompts.ts` | System prompt for content generation |
| `routes/ai.ts` | POST `/ai/videos/:id/analyze` endpoint |

### FFmpeg Audio Extraction

```bash
ffmpeg -threads 0 -analyzeduration 0 -probesize 32768 -i <video_url> -vn -ac 1 -ar 16000 -af "silenceremove=1:0:-50dB:1:1:-50dB,atempo=2.0" -f mp3 -b:a 32k -
```

| Flag | Effect |
|------|--------|
| `-threads 0` | Auto-detect CPU cores |
| `-analyzeduration 0` | Skip duration analysis |
| `-probesize 32768` | Smaller probe size |
| `-vn` | No video |
| `-ac 1` | Mono |
| `-ar 16000` | 16kHz sample rate |
| `silenceremove` | Remove silence |
| `atempo=2.0` | 2x speed |
| `-b:a 32k` | 32kbps bitrate |

### Deployment (Railway)

FFmpeg required via Railpack:

```
RAILPACK_DEPLOY_APT_PACKAGES=ffmpeg
```

### Environment

```
GROQ_API_KEY=gsk_xxxxx
```
