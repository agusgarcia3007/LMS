import { tool } from "ai";
import { db } from "@/db";
import {
  coursesTable,
  courseModulesTable,
  modulesTable,
  moduleItemsTable,
  videosTable,
} from "@/db/schema";
import { eq, and, desc, sql, isNotNull, gt, inArray } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { logger } from "@/lib/logger";
import {
  SIMILARITY_THRESHOLDS,
  CONTENT_SATURATION_THRESHOLDS,
  type ToolContext,
} from "./utils";
import { z } from "zod/v4";

const analyzeContentRepetitionSchema = z.object({
  proposedTitle: z.string().describe("Title of the course being created"),
  proposedDescription: z
    .string()
    .optional()
    .describe("Description of the course"),
  videoIds: z
    .array(z.string().uuid())
    .optional()
    .describe("Video IDs planned for the course"),
  moduleIds: z
    .array(z.string().uuid())
    .optional()
    .describe("Module IDs planned for the course"),
});

type SimilarCourse = {
  id: string;
  title: string;
  similarity: number;
  status: string;
};

type SaturationItem = {
  id: string;
  title: string;
  usedInCourses: number;
  courseNames: string[];
};

type AnalysisResult = {
  similarCourses: SimilarCourse[];
  videoSaturation: SaturationItem[];
  moduleSaturation: SaturationItem[];
  warnings: string[];
  suggestions: string[];
  canProceed: true;
};

async function checkCourseSimilarity(
  tenantId: string,
  queryEmbedding: number[]
): Promise<SimilarCourse[]> {
  const similarity = sql<number>`1 - (${cosineDistance(coursesTable.embedding, queryEmbedding)})`;

  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      status: coursesTable.status,
      similarity,
    })
    .from(coursesTable)
    .where(
      and(
        eq(coursesTable.tenantId, tenantId),
        isNotNull(coursesTable.embedding),
        gt(similarity, SIMILARITY_THRESHOLDS.COURSE_SIMILARITY_WARNING)
      )
    )
    .orderBy(desc(similarity))
    .limit(5);

  return results.map((c) => ({
    id: c.id,
    title: c.title,
    similarity: c.similarity,
    status: c.status,
  }));
}

async function checkVideoSaturation(
  tenantId: string,
  videoIds: string[]
): Promise<SaturationItem[]> {
  if (videoIds.length === 0) return [];

  const videoUsage = await db
    .select({
      videoId: moduleItemsTable.contentId,
      videoTitle: videosTable.title,
      courseId: coursesTable.id,
      courseTitle: coursesTable.title,
    })
    .from(moduleItemsTable)
    .innerJoin(
      courseModulesTable,
      eq(moduleItemsTable.moduleId, courseModulesTable.moduleId)
    )
    .innerJoin(coursesTable, eq(courseModulesTable.courseId, coursesTable.id))
    .innerJoin(videosTable, eq(moduleItemsTable.contentId, videosTable.id))
    .where(
      and(
        eq(moduleItemsTable.contentType, "video"),
        inArray(moduleItemsTable.contentId, videoIds),
        eq(coursesTable.tenantId, tenantId)
      )
    );

  const videoMap = new Map<
    string,
    { title: string; courses: Set<string>; courseNames: string[] }
  >();

  for (const row of videoUsage) {
    const existing = videoMap.get(row.videoId) || {
      title: row.videoTitle,
      courses: new Set<string>(),
      courseNames: [],
    };
    if (!existing.courses.has(row.courseId)) {
      existing.courses.add(row.courseId);
      existing.courseNames.push(row.courseTitle);
    }
    videoMap.set(row.videoId, existing);
  }

  const saturated: SaturationItem[] = [];
  for (const [videoId, data] of videoMap) {
    if (data.courses.size >= CONTENT_SATURATION_THRESHOLDS.VIDEO_USAGE_WARNING) {
      saturated.push({
        id: videoId,
        title: data.title,
        usedInCourses: data.courses.size,
        courseNames: data.courseNames,
      });
    }
  }

  return saturated;
}

async function checkModuleSaturation(
  tenantId: string,
  moduleIds: string[]
): Promise<SaturationItem[]> {
  if (moduleIds.length === 0) return [];

  const moduleUsage = await db
    .select({
      moduleId: courseModulesTable.moduleId,
      moduleTitle: modulesTable.title,
      courseId: coursesTable.id,
      courseTitle: coursesTable.title,
    })
    .from(courseModulesTable)
    .innerJoin(modulesTable, eq(courseModulesTable.moduleId, modulesTable.id))
    .innerJoin(coursesTable, eq(courseModulesTable.courseId, coursesTable.id))
    .where(
      and(
        inArray(courseModulesTable.moduleId, moduleIds),
        eq(coursesTable.tenantId, tenantId)
      )
    );

  const moduleMap = new Map<
    string,
    { title: string; courses: Set<string>; courseNames: string[] }
  >();

  for (const row of moduleUsage) {
    const existing = moduleMap.get(row.moduleId) || {
      title: row.moduleTitle,
      courses: new Set<string>(),
      courseNames: [],
    };
    if (!existing.courses.has(row.courseId)) {
      existing.courses.add(row.courseId);
      existing.courseNames.push(row.courseTitle);
    }
    moduleMap.set(row.moduleId, existing);
  }

  const saturated: SaturationItem[] = [];
  for (const [moduleId, data] of moduleMap) {
    if (data.courses.size >= CONTENT_SATURATION_THRESHOLDS.MODULE_USAGE_WARNING) {
      saturated.push({
        id: moduleId,
        title: data.title,
        usedInCourses: data.courses.size,
        courseNames: data.courseNames,
      });
    }
  }

  return saturated;
}

function buildWarnings(
  similarCourses: SimilarCourse[],
  videoSaturation: SaturationItem[],
  moduleSaturation: SaturationItem[]
): { warnings: string[]; suggestions: string[] } {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (similarCourses.length > 0) {
    const highSimilarity = similarCourses.filter(
      (c) => c.similarity >= SIMILARITY_THRESHOLDS.COURSE_SIMILARITY_HIGH
    );

    if (highSimilarity.length > 0) {
      const titles = highSimilarity.map((c) => c.title).join('", "');
      const percentage = Math.round(highSimilarity[0].similarity * 100);
      warnings.push(
        `Ya tienes ${highSimilarity.length} curso(s) muy similar(es): "${titles}" (${percentage}% similar). Considera actualizar el existente o agregar contenido diferenciador.`
      );
      suggestions.push(
        "Podrias actualizar el curso existente en lugar de crear uno nuevo."
      );
    } else {
      warnings.push(
        `Encontre ${similarCourses.length} curso(s) con contenido relacionado. Revisa si hay solapamiento.`
      );
    }
  }

  if (videoSaturation.length > 0) {
    const highUsage = videoSaturation.filter(
      (v) => v.usedInCourses >= CONTENT_SATURATION_THRESHOLDS.VIDEO_USAGE_HIGH
    );

    if (highUsage.length > 0) {
      warnings.push(
        `${highUsage.length} video(s) ya aparecen en ${CONTENT_SATURATION_THRESHOLDS.VIDEO_USAGE_HIGH}+ cursos. Considera subir contenido nuevo para ofrecer variedad.`
      );
      suggestions.push(
        "Subir nuevos videos desde el panel de Contenido te permitira crear cursos mas diversos y atractivos."
      );
    } else {
      warnings.push(
        `Algunos videos seleccionados ya aparecen en ${CONTENT_SATURATION_THRESHOLDS.VIDEO_USAGE_WARNING}+ cursos.`
      );
    }
  }

  if (moduleSaturation.length > 0) {
    warnings.push(`Algunos modulos ya estan en uso en multiples cursos.`);
  }

  if (warnings.length === 0) {
    suggestions.push(
      "No se detectaron problemas de repeticion. El curso parece unico."
    );
  }

  return { warnings, suggestions };
}

export function createContentAnalysisTools(ctx: ToolContext) {
  const { tenantId, getCachedEmbedding } = ctx;

  return {
    analyzeContentRepetition: tool({
      description: `Analyze potential content repetition before creating a course.
Call this BEFORE creating a course to check:
1. If similar courses already exist (semantic similarity)
2. If videos/modules are overused across courses (content saturation)

Returns warnings and suggestions but NEVER blocks creation.
User can always proceed if they want.`,
      inputSchema: analyzeContentRepetitionSchema,
      execute: async ({
        proposedTitle,
        proposedDescription,
        videoIds,
        moduleIds,
      }) => {
        const courseText =
          `${proposedTitle} ${proposedDescription || ""}`.trim();

        const [queryEmbedding, videoSaturation, moduleSaturation] =
          await Promise.all([
            getCachedEmbedding(courseText),
            checkVideoSaturation(tenantId, videoIds || []),
            checkModuleSaturation(tenantId, moduleIds || []),
          ]);

        const similarCourses = await checkCourseSimilarity(
          tenantId,
          queryEmbedding
        );

        const { warnings, suggestions } = buildWarnings(
          similarCourses,
          videoSaturation,
          moduleSaturation
        );

        const result: AnalysisResult = {
          similarCourses,
          videoSaturation,
          moduleSaturation,
          warnings,
          suggestions,
          canProceed: true,
        };

        logger.info("analyzeContentRepetition executed", {
          proposedTitle,
          similarCoursesFound: similarCourses.length,
          saturatedVideos: videoSaturation.length,
          saturatedModules: moduleSaturation.length,
          warningCount: warnings.length,
        });

        return result;
      },
    }),
  };
}
