# LMS Monorepo

## Structure

```
apps/
├── client/   # React + Vite + Tailwind v4 + shadcn/ui
└── server/   # Elysia + Bun + Drizzle + PostgreSQL
```

## Multi-Tenant

- Each tenant has subdomain: `tenant1.domain.com`
- Users isolated by tenant
- Superadmin has global access
- Dev: use `X-Tenant-Slug` header

## TypeScript

- Create abstractions only when needed
- Clear names over comments
- No emojis, no `any` casts, minimal `try/catch`

## React

- Small composable components
- Colocate related code
- Avoid `useEffect`

## Button Component

- Use `isLoading` prop to show spinner
- On mobile, hides children when loading (shows only spinner)

## TanStack Query

- Global `onError` handler (`catchAxiosError`) for all mutations
- No try/catch or custom onError needed in components
- Mutations: `const {mutate, isPending} = useMyMutation()`
- Queries: `const {data, isLoading} = useMyQuery()`
- Use `isPending` for loading states in forms/buttons

## Services Structure

Each service in `apps/client/src/services/` follows this pattern:

```
services/
└── [resource]/
    ├── service.ts    # Types, QUERY_KEYS, and HTTP calls (ResourceService)
    ├── options.ts    # queryOptions and mutationOptions
    ├── queries.ts    # useQuery hooks (useGetResource, etc.)
    └── mutations.ts  # useMutation hooks (useUpdateResource, etc.)
```

## Tailwind

- Use v4 + shadcn/ui
- Prefer built-in values

## Elysia API (Server)

All route handlers use `withHandler` wrapper for consistent error handling and logging:

```typescript
import { withHandler } from "@/lib/handler";

routes.get("/", (ctx) =>
  withHandler(ctx, async () => {
    if (!ctx.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
    }
    return { data: ctx.user };
  })
);
```

- `withHandler` automatically logs errors with endpoint context: `[GET /profile] Error: ...`
- Throw `AppError` for expected errors (sets status code)
- Unknown errors become 500 with generic message
- Never use manual try/catch in routes
- Never add comments in the code
- Always use descriptive function names

## Database Indexes

Always add indexes on columns used for filtering, especially:
- Foreign keys (`tenantId`, `userId`, etc.)
- Columns used in WHERE clauses (`role`, `status`, etc.)

```typescript
import { pgTable, uuid, index } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  tenantId: uuid("tenant_id").references(() => tenantsTable.id),
  role: userRoleEnum("role").notNull(),
}, (table) => [
  index("users_tenant_id_idx").on(table.tenantId),
  index("users_role_idx").on(table.role),
]);
```

## Server Filters

The filter system in `apps/server/src/lib/filters.ts` handles pagination, sorting, search, and filters.

### URL Format

Filters are sent as query params with format `field=value`:
- Text/Select: `role=admin` or `role=admin,owner` (comma for multiple)
- Date range: `createdAt=2025-01-01,2025-01-31` (from,to)

### Usage in Routes

```typescript
import {
  parseListParams,
  buildWhereClause,
  type FieldMap,
  type SearchableFields,
  type DateFields,
} from "@/lib/filters";

const fieldMap: FieldMap<typeof table> = {
  name: table.name,
  createdAt: table.createdAt,
};

const searchableFields: SearchableFields<typeof table> = [table.name];
const dateFields: DateFields = new Set(["createdAt"]);

// In route handler:
const params = parseListParams(ctx.query);
const whereClause = buildWhereClause(params, fieldMap, searchableFields, dateFields);
```

### Filter Types

| Type | URL Example | Server Behavior |
|------|-------------|-----------------|
| Single value | `role=admin` | `eq(column, value)` |
| Multiple values | `role=admin,owner` | `inArray(column, values)` |
| Date range | `createdAt=2025-01-01,2025-01-31` | `gte(column, from) AND lte(column, to)` |
| Text search | `search=john` | `ilike(column, '%john%')` on searchable fields |

### Custom Filters

For filters that don't map directly to a column (e.g., searching by related table):

```typescript
// Remove from fieldMap, handle manually:
const tenantNameFilter = ctx.query.tenantId
  ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
  : undefined;

const whereClause = baseWhereClause && tenantNameFilter
  ? and(baseWhereClause, tenantNameFilter)
  : baseWhereClause ?? tenantNameFilter;
```
