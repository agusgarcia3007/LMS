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
  categoriesTable,
  instructorsTable,
  videosTable,
  documentsTable,
} from "@/db/schema";
import { count, sql, eq, gte, and, desc, ilike } from "drizzle-orm";
import {
  parseListParams,
  buildWhereClause,
  getSortColumn,
  getPaginationParams,
  calculatePagination,
  type FieldMap,
  type SearchableFields,
  type DateFields,
} from "@/lib/filters";
import { getPresignedUrl } from "@/lib/upload";

const categoryFieldMap: FieldMap<typeof categoriesTable> = {
  id: categoriesTable.id,
  name: categoriesTable.name,
  slug: categoriesTable.slug,
  order: categoriesTable.order,
  createdAt: categoriesTable.createdAt,
  updatedAt: categoriesTable.updatedAt,
};

const categorySearchableFields: SearchableFields<typeof categoriesTable> = [
  categoriesTable.name,
  categoriesTable.slug,
];

const categoryDateFields: DateFields = new Set(["createdAt"]);

const instructorFieldMap: FieldMap<typeof instructorsTable> = {
  id: instructorsTable.id,
  name: instructorsTable.name,
  title: instructorsTable.title,
  email: instructorsTable.email,
  order: instructorsTable.order,
  createdAt: instructorsTable.createdAt,
  updatedAt: instructorsTable.updatedAt,
};

const instructorSearchableFields: SearchableFields<typeof instructorsTable> = [
  instructorsTable.name,
  instructorsTable.title,
  instructorsTable.email,
];

const instructorDateFields: DateFields = new Set(["createdAt"]);

const videoFieldMap: FieldMap<typeof videosTable> = {
  id: videosTable.id,
  title: videosTable.title,
  status: videosTable.status,
  duration: videosTable.duration,
  createdAt: videosTable.createdAt,
  updatedAt: videosTable.updatedAt,
};

const videoSearchableFields: SearchableFields<typeof videosTable> = [
  videosTable.title,
];

const videoDateFields: DateFields = new Set(["createdAt"]);

const documentFieldMap: FieldMap<typeof documentsTable> = {
  id: documentsTable.id,
  title: documentsTable.title,
  status: documentsTable.status,
  fileName: documentsTable.fileName,
  createdAt: documentsTable.createdAt,
  updatedAt: documentsTable.updatedAt,
};

const documentSearchableFields: SearchableFields<typeof documentsTable> = [
  documentsTable.title,
  documentsTable.fileName,
];

const documentDateFields: DateFields = new Set(["createdAt"]);

const enrollmentFieldMap: FieldMap<typeof enrollmentsTable> = {
  id: enrollmentsTable.id,
  status: enrollmentsTable.status,
  progress: enrollmentsTable.progress,
  createdAt: enrollmentsTable.createdAt,
  updatedAt: enrollmentsTable.updatedAt,
  completedAt: enrollmentsTable.completedAt,
};

const enrollmentDateFields: DateFields = new Set(["createdAt", "completedAt"]);

const certificateFieldMap: FieldMap<typeof certificatesTable> = {
  id: certificatesTable.id,
  verificationCode: certificatesTable.verificationCode,
  userName: certificatesTable.userName,
  courseName: certificatesTable.courseName,
  issuedAt: certificatesTable.issuedAt,
  createdAt: certificatesTable.createdAt,
};

const certificateSearchableFields: SearchableFields<typeof certificatesTable> = [
  certificatesTable.userName,
  certificatesTable.courseName,
  certificatesTable.verificationCode,
];

const certificateDateFields: DateFields = new Set(["issuedAt", "createdAt"]);

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
  )
  .get(
    "/categories",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          categoryFieldMap,
          categorySearchableFields,
          categoryDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const whereClause =
          baseWhereClause && tenantFilter
            ? and(baseWhereClause, tenantFilter)
            : baseWhereClause ?? tenantFilter;

        const sortColumn = getSortColumn(params.sort, categoryFieldMap, {
          field: "createdAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            slug: categoriesTable.slug,
            description: categoriesTable.description,
            order: categoriesTable.order,
            tenantId: categoriesTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            createdAt: categoriesTable.createdAt,
            updatedAt: categoriesTable.updatedAt,
            coursesCount: sql<number>`(
              SELECT COUNT(*) FROM ${coursesTable}
              WHERE ${coursesTable.categoryId} = ${categoriesTable.id}
            )::int`,
          })
          .from(categoriesTable)
          .leftJoin(tenantsTable, eq(categoriesTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(categoriesTable)
          .leftJoin(tenantsTable, eq(categoriesTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [categories, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        return {
          categories: categories.map((cat) => ({
            ...cat,
            tenant: cat.tenantId
              ? { id: cat.tenantId, name: cat.tenantName, slug: cat.tenantSlug }
              : null,
          })),
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        createdAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all categories across tenants (superadmin only)",
      },
    }
  )
  .get(
    "/instructors",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          instructorFieldMap,
          instructorSearchableFields,
          instructorDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const whereClause =
          baseWhereClause && tenantFilter
            ? and(baseWhereClause, tenantFilter)
            : baseWhereClause ?? tenantFilter;

        const sortColumn = getSortColumn(params.sort, instructorFieldMap, {
          field: "createdAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: instructorsTable.id,
            name: instructorsTable.name,
            avatar: instructorsTable.avatar,
            bio: instructorsTable.bio,
            title: instructorsTable.title,
            email: instructorsTable.email,
            website: instructorsTable.website,
            socialLinks: instructorsTable.socialLinks,
            order: instructorsTable.order,
            tenantId: instructorsTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            createdAt: instructorsTable.createdAt,
            updatedAt: instructorsTable.updatedAt,
            coursesCount: sql<number>`(
              SELECT COUNT(*) FROM ${coursesTable}
              WHERE ${coursesTable.instructorId} = ${instructorsTable.id}
            )::int`,
          })
          .from(instructorsTable)
          .leftJoin(tenantsTable, eq(instructorsTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(instructorsTable)
          .leftJoin(tenantsTable, eq(instructorsTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [instructors, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        const instructorsWithUrls = await Promise.all(
          instructors.map(async (instructor) => ({
            ...instructor,
            avatar: instructor.avatar
              ? await getPresignedUrl(instructor.avatar)
              : null,
            tenant: instructor.tenantId
              ? {
                  id: instructor.tenantId,
                  name: instructor.tenantName,
                  slug: instructor.tenantSlug,
                }
              : null,
          }))
        );

        return {
          instructors: instructorsWithUrls,
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        createdAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all instructors across tenants (superadmin only)",
      },
    }
  )
  .get(
    "/videos",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          videoFieldMap,
          videoSearchableFields,
          videoDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const statusFilter = ctx.query.status
          ? eq(videosTable.status, ctx.query.status as "draft" | "published")
          : undefined;

        const filters = [baseWhereClause, tenantFilter, statusFilter].filter(
          Boolean
        );
        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const sortColumn = getSortColumn(params.sort, videoFieldMap, {
          field: "createdAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: videosTable.id,
            title: videosTable.title,
            description: videosTable.description,
            videoKey: videosTable.videoKey,
            duration: videosTable.duration,
            status: videosTable.status,
            tenantId: videosTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            createdAt: videosTable.createdAt,
            updatedAt: videosTable.updatedAt,
          })
          .from(videosTable)
          .leftJoin(tenantsTable, eq(videosTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(videosTable)
          .leftJoin(tenantsTable, eq(videosTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [videos, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        const videosWithUrls = await Promise.all(
          videos.map(async (video) => ({
            ...video,
            videoUrl: video.videoKey
              ? await getPresignedUrl(video.videoKey)
              : null,
            tenant: video.tenantId
              ? {
                  id: video.tenantId,
                  name: video.tenantName,
                  slug: video.tenantSlug,
                }
              : null,
          }))
        );

        return {
          videos: videosWithUrls,
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        status: t.Optional(t.String()),
        createdAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all videos across tenants (superadmin only)",
      },
    }
  )
  .get(
    "/documents",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          documentFieldMap,
          documentSearchableFields,
          documentDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const statusFilter = ctx.query.status
          ? eq(documentsTable.status, ctx.query.status as "draft" | "published")
          : undefined;

        const filters = [baseWhereClause, tenantFilter, statusFilter].filter(
          Boolean
        );
        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const sortColumn = getSortColumn(params.sort, documentFieldMap, {
          field: "createdAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: documentsTable.id,
            title: documentsTable.title,
            description: documentsTable.description,
            fileKey: documentsTable.fileKey,
            fileName: documentsTable.fileName,
            fileSize: documentsTable.fileSize,
            mimeType: documentsTable.mimeType,
            status: documentsTable.status,
            tenantId: documentsTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            createdAt: documentsTable.createdAt,
            updatedAt: documentsTable.updatedAt,
          })
          .from(documentsTable)
          .leftJoin(tenantsTable, eq(documentsTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(documentsTable)
          .leftJoin(tenantsTable, eq(documentsTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [documents, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        const documentsWithUrls = await Promise.all(
          documents.map(async (doc) => ({
            ...doc,
            fileUrl: doc.fileKey ? await getPresignedUrl(doc.fileKey) : null,
            tenant: doc.tenantId
              ? {
                  id: doc.tenantId,
                  name: doc.tenantName,
                  slug: doc.tenantSlug,
                }
              : null,
          }))
        );

        return {
          documents: documentsWithUrls,
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        status: t.Optional(t.String()),
        createdAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all documents across tenants (superadmin only)",
      },
    }
  )
  .get(
    "/enrollments",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          enrollmentFieldMap,
          [],
          enrollmentDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const statusFilter = ctx.query.status
          ? eq(enrollmentsTable.status, ctx.query.status as "active" | "completed" | "cancelled")
          : undefined;

        const filters = [baseWhereClause, tenantFilter, statusFilter].filter(
          Boolean
        );
        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const sortColumn = getSortColumn(params.sort, enrollmentFieldMap, {
          field: "createdAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: enrollmentsTable.id,
            userId: enrollmentsTable.userId,
            userName: usersTable.name,
            userEmail: usersTable.email,
            courseId: enrollmentsTable.courseId,
            courseTitle: coursesTable.title,
            tenantId: enrollmentsTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            status: enrollmentsTable.status,
            progress: enrollmentsTable.progress,
            completedAt: enrollmentsTable.completedAt,
            createdAt: enrollmentsTable.createdAt,
            updatedAt: enrollmentsTable.updatedAt,
          })
          .from(enrollmentsTable)
          .leftJoin(usersTable, eq(enrollmentsTable.userId, usersTable.id))
          .leftJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
          .leftJoin(tenantsTable, eq(enrollmentsTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(enrollmentsTable)
          .leftJoin(tenantsTable, eq(enrollmentsTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [enrollments, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        return {
          enrollments: enrollments.map((enrollment) => ({
            ...enrollment,
            user: enrollment.userId
              ? {
                  id: enrollment.userId,
                  name: enrollment.userName,
                  email: enrollment.userEmail,
                }
              : null,
            course: enrollment.courseId
              ? {
                  id: enrollment.courseId,
                  title: enrollment.courseTitle,
                }
              : null,
            tenant: enrollment.tenantId
              ? {
                  id: enrollment.tenantId,
                  name: enrollment.tenantName,
                  slug: enrollment.tenantSlug,
                }
              : null,
          })),
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        status: t.Optional(t.String()),
        createdAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all enrollments across tenants (superadmin only)",
      },
    }
  )
  .get(
    "/certificates",
    (ctx) =>
      withHandler(ctx, async () => {
        requireSuperadmin(ctx);

        const params = parseListParams(ctx.query);
        const baseWhereClause = buildWhereClause(
          params,
          certificateFieldMap,
          certificateSearchableFields,
          certificateDateFields
        );

        const tenantFilter = ctx.query.tenantId
          ? ilike(tenantsTable.name, `%${ctx.query.tenantId}%`)
          : undefined;

        const filters = [baseWhereClause, tenantFilter].filter(Boolean);
        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const sortColumn = getSortColumn(params.sort, certificateFieldMap, {
          field: "issuedAt",
          order: "desc",
        });
        const { limit, offset } = getPaginationParams(params.page, params.limit);

        const baseQuery = db
          .select({
            id: certificatesTable.id,
            verificationCode: certificatesTable.verificationCode,
            imageKey: certificatesTable.imageKey,
            userName: certificatesTable.userName,
            courseName: certificatesTable.courseName,
            userId: certificatesTable.userId,
            courseId: certificatesTable.courseId,
            tenantId: certificatesTable.tenantId,
            tenantName: tenantsTable.name,
            tenantSlug: tenantsTable.slug,
            issuedAt: certificatesTable.issuedAt,
            createdAt: certificatesTable.createdAt,
          })
          .from(certificatesTable)
          .leftJoin(tenantsTable, eq(certificatesTable.tenantId, tenantsTable.id));

        let query = baseQuery.$dynamic();
        if (whereClause) {
          query = query.where(whereClause);
        }
        if (sortColumn) {
          query = query.orderBy(sortColumn);
        }
        query = query.limit(limit).offset(offset);

        const countQuery = db
          .select({ count: count() })
          .from(certificatesTable)
          .leftJoin(tenantsTable, eq(certificatesTable.tenantId, tenantsTable.id));

        let countQueryDynamic = countQuery.$dynamic();
        if (whereClause) {
          countQueryDynamic = countQueryDynamic.where(whereClause);
        }

        const [certificates, [{ count: total }]] = await Promise.all([
          query,
          countQueryDynamic,
        ]);

        const certificatesWithUrls = await Promise.all(
          certificates.map(async (cert) => ({
            ...cert,
            imageUrl: cert.imageKey ? await getPresignedUrl(cert.imageKey) : null,
            tenant: cert.tenantId
              ? {
                  id: cert.tenantId,
                  name: cert.tenantName,
                  slug: cert.tenantSlug,
                }
              : null,
          }))
        );

        return {
          certificates: certificatesWithUrls,
          pagination: calculatePagination(total, params.page, params.limit),
        };
      }),
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String()),
        tenantId: t.Optional(t.String()),
        issuedAt: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Backoffice"],
        summary: "List all certificates across tenants (superadmin only)",
      },
    }
  );
