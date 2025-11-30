import { Elysia, t } from "elysia";
import { tenantPlugin } from "@/plugins/tenant";
import { withHandler } from "@/lib/handler";
import { AppError, ErrorCode } from "@/lib/errors";
import { MOCK_COURSES, MOCK_CATEGORIES } from "@/data/mock-courses";

export const campusRoutes = new Elysia({ name: "campus" })
  .use(tenantPlugin)
  .get("/tenant", (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }
      return {
        tenant: {
          id: ctx.tenant.id,
          name: ctx.tenant.name,
          slug: ctx.tenant.slug,
        },
      };
    })
  )
  .get(
    "/courses",
    (ctx) =>
      withHandler(ctx, async () => {
        if (!ctx.tenant) {
          throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
        }

        const { category, level, search, page = "1", limit = "12" } = ctx.query;

        let courses = [...MOCK_COURSES];

        if (category) {
          courses = courses.filter((c) => c.category === category);
        }

        if (level) {
          courses = courses.filter((c) => c.level === level);
        }

        if (search) {
          const searchLower = search.toLowerCase();
          courses = courses.filter(
            (c) =>
              c.title.toLowerCase().includes(searchLower) ||
              c.shortDescription.toLowerCase().includes(searchLower) ||
              c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          );
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const total = courses.length;
        const totalPages = Math.ceil(total / limitNum);
        const offset = (pageNum - 1) * limitNum;
        const paginated = courses.slice(offset, offset + limitNum);

        return {
          courses: paginated,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
          },
        };
      }),
    {
      query: t.Object({
        category: t.Optional(t.String()),
        level: t.Optional(t.String()),
        search: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )
  .get("/courses/:slug", (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }

      const course = MOCK_COURSES.find((c) => c.slug === ctx.params.slug);

      if (!course) {
        throw new AppError(ErrorCode.NOT_FOUND, "Course not found", 404);
      }

      return { course };
    })
  )
  .get("/categories", (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }
      return { categories: MOCK_CATEGORIES };
    })
  )
  .get("/stats", (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.tenant) {
        throw new AppError(ErrorCode.TENANT_NOT_FOUND, "Tenant not found", 404);
      }

      const totalCourses = MOCK_COURSES.length;
      const totalStudents = MOCK_COURSES.reduce((acc, c) => acc + c.studentsCount, 0);
      const categories = MOCK_CATEGORIES.length;

      return {
        stats: {
          totalCourses,
          totalStudents,
          categories,
        },
      };
    })
  );
