import { Elysia, t } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { withHandler } from "@/lib/handler";
import { db } from "@/db";
import {
  tenantsTable,
  usersTable,
  coursesTable,
  enrollmentsTable,
  certificatesTable,
} from "@/db/schema";
import { count, sql, eq, gte, and, desc } from "drizzle-orm";

function requireSuperadmin(ctx: { user: unknown; userRole: string | null }) {
  if (!ctx.user) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
  }
  if (ctx.userRole !== "superadmin") {
    throw new AppError(
      ErrorCode.SUPERADMIN_REQUIRED,
      "Only superadmins can access backoffice stats",
      403
    );
  }
}

export const backofficeRoutes = new Elysia()
  .use(authPlugin)
  .get(
    "/stats",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [
          usersResult,
          tenantsResult,
          coursesResult,
          enrollmentsResult,
          certificatesResult,
          activeUsersResult,
          usersLast30d,
          usersPrev30d,
          tenantsLast30d,
          tenantsPrev30d,
          enrollmentsLast30d,
          enrollmentsPrev30d,
          completedEnrollmentsResult,
          revenueResult,
          avgProgressResult,
        ] = await Promise.all([
          db.select({ count: count() }).from(usersTable),
          db.select({ count: count() }).from(tenantsTable),
          db.select({ count: count() }).from(coursesTable),
          db.select({ count: count() }).from(enrollmentsTable),
          db.select({ count: count() }).from(certificatesTable),
          db
            .select({ count: count() })
            .from(usersTable)
            .where(gte(usersTable.updatedAt, thirtyDaysAgo)),
          db
            .select({ count: count() })
            .from(usersTable)
            .where(gte(usersTable.createdAt, thirtyDaysAgo)),
          db
            .select({ count: count() })
            .from(usersTable)
            .where(
              and(
                gte(usersTable.createdAt, sixtyDaysAgo),
                sql`${usersTable.createdAt} < ${thirtyDaysAgo}`
              )
            ),
          db
            .select({ count: count() })
            .from(tenantsTable)
            .where(gte(tenantsTable.createdAt, thirtyDaysAgo)),
          db
            .select({ count: count() })
            .from(tenantsTable)
            .where(
              and(
                gte(tenantsTable.createdAt, sixtyDaysAgo),
                sql`${tenantsTable.createdAt} < ${thirtyDaysAgo}`
              )
            ),
          db
            .select({ count: count() })
            .from(enrollmentsTable)
            .where(gte(enrollmentsTable.createdAt, thirtyDaysAgo)),
          db
            .select({ count: count() })
            .from(enrollmentsTable)
            .where(
              and(
                gte(enrollmentsTable.createdAt, sixtyDaysAgo),
                sql`${enrollmentsTable.createdAt} < ${thirtyDaysAgo}`
              )
            ),
          db
            .select({ count: count() })
            .from(enrollmentsTable)
            .where(eq(enrollmentsTable.status, "completed")),
          db
            .select({
              total: sql<number>`COALESCE(SUM(${coursesTable.price}), 0)`,
              avgPrice: sql<number>`COALESCE(AVG(${coursesTable.price}), 0)`,
            })
            .from(enrollmentsTable)
            .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id)),
          db
            .select({
              avgProgress: sql<number>`COALESCE(AVG(${enrollmentsTable.progress}), 0)`,
            })
            .from(enrollmentsTable)
            .where(eq(enrollmentsTable.status, "active")),
        ]);

        const calculateGrowth = (current: number, previous: number): number => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return Math.round(((current - previous) / previous) * 100);
        };

        const totalEnrollments = enrollmentsResult[0].count;
        const completedEnrollments = completedEnrollmentsResult[0].count;
        const activeEnrollments = totalEnrollments - completedEnrollments;

        return {
          stats: {
            overview: {
              totalUsers: usersResult[0].count,
              totalTenants: tenantsResult[0].count,
              totalCourses: coursesResult[0].count,
              totalEnrollments,
              totalCertificates: certificatesResult[0].count,
              activeUsers30d: activeUsersResult[0].count,
            },
            growth: {
              usersChange: calculateGrowth(
                usersLast30d[0].count,
                usersPrev30d[0].count
              ),
              tenantsChange: calculateGrowth(
                tenantsLast30d[0].count,
                tenantsPrev30d[0].count
              ),
              enrollmentsChange: calculateGrowth(
                enrollmentsLast30d[0].count,
                enrollmentsPrev30d[0].count
              ),
            },
            revenue: {
              total: Number(revenueResult[0].total) / 100,
              avgCoursePrice: Math.round(Number(revenueResult[0].avgPrice) / 100),
            },
            engagement: {
              avgCompletionRate: Math.round(Number(avgProgressResult[0].avgProgress)),
              activeEnrollments,
              completedEnrollments,
            },
          },
        };
      }),
    {
      detail: {
        tags: ["Backoffice"],
        summary: "Get comprehensive backoffice dashboard stats (superadmin only)",
      },
    }
  )
  .get(
    "/stats/trends",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const period = (ctx.query.period as string) || "30d";
        const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [userGrowth, enrollmentGrowth, certificatesIssued] =
          await Promise.all([
            db
              .select({
                date: sql<string>`DATE(${usersTable.createdAt})`.as("date"),
                count: count(),
              })
              .from(usersTable)
              .where(gte(usersTable.createdAt, startDate))
              .groupBy(sql`DATE(${usersTable.createdAt})`)
              .orderBy(sql`DATE(${usersTable.createdAt})`),
            db
              .select({
                date: sql<string>`DATE(${enrollmentsTable.createdAt})`.as("date"),
                count: count(),
              })
              .from(enrollmentsTable)
              .where(gte(enrollmentsTable.createdAt, startDate))
              .groupBy(sql`DATE(${enrollmentsTable.createdAt})`)
              .orderBy(sql`DATE(${enrollmentsTable.createdAt})`),
            db
              .select({
                date: sql<string>`DATE(${certificatesTable.issuedAt})`.as("date"),
                count: count(),
              })
              .from(certificatesTable)
              .where(gte(certificatesTable.issuedAt, startDate))
              .groupBy(sql`DATE(${certificatesTable.issuedAt})`)
              .orderBy(sql`DATE(${certificatesTable.issuedAt})`),
          ]);

        return {
          trends: {
            userGrowth: userGrowth.map((r) => ({
              date: r.date,
              count: r.count,
            })),
            enrollmentGrowth: enrollmentGrowth.map((r) => ({
              date: r.date,
              count: r.count,
            })),
            certificatesIssued: certificatesIssued.map((r) => ({
              date: r.date,
              count: r.count,
            })),
            period,
          },
        };
      }),
    {
      query: t.Object({
        period: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "Get time-series trends data (superadmin only)",
      },
    }
  )
  .get(
    "/stats/top-courses",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const limit = Number(ctx.query.limit) || 5;

        const topCourses = await db
          .select({
            id: coursesTable.id,
            title: coursesTable.title,
            tenantId: coursesTable.tenantId,
            tenantName: tenantsTable.name,
            price: coursesTable.price,
            enrollments: sql<number>`COUNT(${enrollmentsTable.id})::int`,
            completedCount: sql<number>`COUNT(CASE WHEN ${enrollmentsTable.status} = 'completed' THEN 1 END)::int`,
            revenue: sql<number>`(COUNT(${enrollmentsTable.id}) * ${coursesTable.price})::int`,
          })
          .from(coursesTable)
          .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
          .leftJoin(tenantsTable, eq(coursesTable.tenantId, tenantsTable.id))
          .groupBy(coursesTable.id, tenantsTable.name)
          .orderBy(desc(sql`COUNT(${enrollmentsTable.id})`))
          .limit(limit);

        return {
          courses: topCourses.map((course) => ({
            id: course.id,
            title: course.title,
            tenantName: course.tenantName,
            enrollments: course.enrollments,
            completionRate:
              course.enrollments > 0
                ? Math.round((course.completedCount / course.enrollments) * 100)
                : 0,
            revenue: course.revenue / 100,
          })),
        };
      }),
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "Get top performing courses (superadmin only)",
      },
    }
  )
  .get(
    "/stats/top-tenants",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const limit = Number(ctx.query.limit) || 5;

        const topTenants = await db
          .select({
            id: tenantsTable.id,
            name: tenantsTable.name,
            slug: tenantsTable.slug,
            usersCount: sql<number>`(
              SELECT COUNT(*) FROM ${usersTable}
              WHERE ${usersTable.tenantId} = ${tenantsTable.id}
            )::int`,
            coursesCount: sql<number>`(
              SELECT COUNT(*) FROM ${coursesTable}
              WHERE ${coursesTable.tenantId} = ${tenantsTable.id}
            )::int`,
            enrollmentsCount: sql<number>`(
              SELECT COUNT(*) FROM ${enrollmentsTable}
              WHERE ${enrollmentsTable.tenantId} = ${tenantsTable.id}
            )::int`,
          })
          .from(tenantsTable)
          .orderBy(
            desc(
              sql`(
                SELECT COUNT(*) FROM ${enrollmentsTable}
                WHERE ${enrollmentsTable.tenantId} = ${tenantsTable.id}
              )`
            )
          )
          .limit(limit);

        return {
          tenants: topTenants.map((tenant) => ({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            usersCount: tenant.usersCount,
            coursesCount: tenant.coursesCount,
            enrollmentsCount: tenant.enrollmentsCount,
          })),
        };
      }),
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "Get top performing tenants (superadmin only)",
      },
    }
  );
