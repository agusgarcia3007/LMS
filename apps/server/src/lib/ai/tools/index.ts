import { tool, generateText } from "ai";
import { db } from "@/db";
import {
  videosTable,
  documentsTable,
  quizzesTable,
  quizQuestionsTable,
  quizOptionsTable,
  modulesTable,
  moduleItemsTable,
  coursesTable,
  courseModulesTable,
} from "@/db/schema";
import { eq, and, ilike, or, desc, sql, isNotNull, gt } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { logger } from "@/lib/logger";
import {
  searchVideosSchema,
  searchDocumentsSchema,
  searchQuizzesSchema,
  searchModulesSchema,
  createQuizSchema,
  createModuleSchema,
  generateCoursePreviewSchema,
  createCourseSchema,
} from "./schemas";
import { generateEmbedding } from "../embeddings";
import { aiGateway } from "../gateway";
import { AI_MODELS } from "../models";
import { THUMBNAIL_GENERATION_PROMPT } from "../prompts";
import { uploadBase64ToS3 } from "@/lib/upload";

export * from "./schemas";

export function createCourseCreatorTools(tenantId: string) {
  return {
    searchVideos: tool({
      description: "Search for existing videos by semantic similarity",
      inputSchema: searchVideosSchema,
      execute: async ({ query, limit }) => {
        const queryEmbedding = await generateEmbedding(query);
        const similarity = sql<number>`1 - (${cosineDistance(videosTable.embedding, queryEmbedding)})`;

        let videos = await db
          .select({
            id: videosTable.id,
            title: videosTable.title,
            description: videosTable.description,
            duration: videosTable.duration,
            similarity,
          })
          .from(videosTable)
          .where(
            and(
              eq(videosTable.tenantId, tenantId),
              eq(videosTable.status, "published"),
              isNotNull(videosTable.embedding),
              gt(similarity, 0.3)
            )
          )
          .orderBy(desc(similarity))
          .limit(limit ?? 10);

        if (videos.length === 0) {
          videos = await db
            .select({
              id: videosTable.id,
              title: videosTable.title,
              description: videosTable.description,
              duration: videosTable.duration,
              similarity: sql<number>`0`.as("similarity"),
            })
            .from(videosTable)
            .where(
              and(
                eq(videosTable.tenantId, tenantId),
                eq(videosTable.status, "published"),
                or(
                  ilike(videosTable.title, `%${query}%`),
                  ilike(videosTable.description, `%${query}%`)
                )
              )
            )
            .orderBy(desc(videosTable.createdAt))
            .limit(limit ?? 10);
        }

        logger.info("searchVideos executed", { query, found: videos.length });
        return { videos, count: videos.length };
      },
    }),

    searchDocuments: tool({
      description: "Search for existing documents by semantic similarity",
      inputSchema: searchDocumentsSchema,
      execute: async ({ query, limit }) => {
        const queryEmbedding = await generateEmbedding(query);
        const similarity = sql<number>`1 - (${cosineDistance(documentsTable.embedding, queryEmbedding)})`;

        let documents = await db
          .select({
            id: documentsTable.id,
            title: documentsTable.title,
            description: documentsTable.description,
            fileName: documentsTable.fileName,
            mimeType: documentsTable.mimeType,
            similarity,
          })
          .from(documentsTable)
          .where(
            and(
              eq(documentsTable.tenantId, tenantId),
              eq(documentsTable.status, "published"),
              isNotNull(documentsTable.embedding),
              gt(similarity, 0.3)
            )
          )
          .orderBy(desc(similarity))
          .limit(limit ?? 10);

        if (documents.length === 0) {
          documents = await db
            .select({
              id: documentsTable.id,
              title: documentsTable.title,
              description: documentsTable.description,
              fileName: documentsTable.fileName,
              mimeType: documentsTable.mimeType,
              similarity: sql<number>`0`.as("similarity"),
            })
            .from(documentsTable)
            .where(
              and(
                eq(documentsTable.tenantId, tenantId),
                eq(documentsTable.status, "published"),
                or(
                  ilike(documentsTable.title, `%${query}%`),
                  ilike(documentsTable.description, `%${query}%`)
                )
              )
            )
            .orderBy(desc(documentsTable.createdAt))
            .limit(limit ?? 10);
        }

        logger.info("searchDocuments executed", { query, found: documents.length });
        return { documents, count: documents.length };
      },
    }),

    searchQuizzes: tool({
      description: "Search for existing quizzes by semantic similarity",
      inputSchema: searchQuizzesSchema,
      execute: async ({ query, limit }) => {
        const queryEmbedding = await generateEmbedding(query);
        const similarity = sql<number>`1 - (${cosineDistance(quizzesTable.embedding, queryEmbedding)})`;

        let quizzes = await db
          .select({
            id: quizzesTable.id,
            title: quizzesTable.title,
            description: quizzesTable.description,
            similarity,
          })
          .from(quizzesTable)
          .where(
            and(
              eq(quizzesTable.tenantId, tenantId),
              eq(quizzesTable.status, "published"),
              isNotNull(quizzesTable.embedding),
              gt(similarity, 0.3)
            )
          )
          .orderBy(desc(similarity))
          .limit(limit ?? 10);

        if (quizzes.length === 0) {
          quizzes = await db
            .select({
              id: quizzesTable.id,
              title: quizzesTable.title,
              description: quizzesTable.description,
              similarity: sql<number>`0`.as("similarity"),
            })
            .from(quizzesTable)
            .where(
              and(
                eq(quizzesTable.tenantId, tenantId),
                eq(quizzesTable.status, "published"),
                or(
                  ilike(quizzesTable.title, `%${query}%`),
                  ilike(quizzesTable.description, `%${query}%`)
                )
              )
            )
            .orderBy(desc(quizzesTable.createdAt))
            .limit(limit ?? 10);
        }

        logger.info("searchQuizzes executed", { query, found: quizzes.length });
        return { quizzes, count: quizzes.length };
      },
    }),

    searchModules: tool({
      description: "Search for existing modules by title/description. Use these modules directly in courses instead of creating new ones.",
      inputSchema: searchModulesSchema,
      execute: async ({ query, limit }) => {
        const modules = await db
          .select({
            id: modulesTable.id,
            title: modulesTable.title,
            description: modulesTable.description,
          })
          .from(modulesTable)
          .where(
            and(
              eq(modulesTable.tenantId, tenantId),
              eq(modulesTable.status, "published"),
              or(
                ilike(modulesTable.title, `%${query}%`),
                ilike(modulesTable.description, `%${query}%`)
              )
            )
          )
          .orderBy(desc(modulesTable.createdAt))
          .limit(limit ?? 10);

        logger.info("searchModules executed", { query, found: modules.length });
        return { modules, count: modules.length };
      },
    }),

    createQuiz: tool({
      description: "Create a new quiz with questions and options. Quiz is created as published.",
      inputSchema: createQuizSchema,
      execute: async ({ title, description, questions }) => {
        const [quiz] = await db
          .insert(quizzesTable)
          .values({
            tenantId,
            title,
            description: description ?? null,
            status: "published",
          })
          .returning();

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const [question] = await db
            .insert(quizQuestionsTable)
            .values({
              quizId: quiz.id,
              tenantId,
              type: q.type === "true_false" ? "true_false" : "multiple_choice",
              questionText: q.questionText,
              explanation: q.explanation ?? null,
              order: i,
            })
            .returning();

          for (let j = 0; j < q.options.length; j++) {
            const opt = q.options[j];
            await db.insert(quizOptionsTable).values({
              questionId: question.id,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              order: j,
            });
          }
        }

        logger.info("createQuiz executed", {
          quizId: quiz.id,
          questionCount: questions.length,
        });

        return {
          id: quiz.id,
          title: quiz.title,
          questionsCount: questions.length,
        };
      },
    }),

    createModule: tool({
      description: "Create a new module with content items. Module is created as published.",
      inputSchema: createModuleSchema,
      execute: async ({ title, description, items }) => {
        const [module] = await db
          .insert(modulesTable)
          .values({
            tenantId,
            title,
            description: description ?? null,
            status: "published",
          })
          .returning();

        for (const item of items) {
          await db.insert(moduleItemsTable).values({
            moduleId: module.id,
            contentType: item.type,
            contentId: item.id,
            order: item.order,
            isPreview: item.isPreview ?? false,
          });
        }

        logger.info("createModule executed", {
          moduleId: module.id,
          itemCount: items.length,
        });

        return {
          id: module.id,
          title: module.title,
          itemsCount: items.length,
        };
      },
    }),

    generateCoursePreview: tool({
      description:
        "Generate a course preview with all the gathered information. Call this to show the user a preview before creating the course.",
      inputSchema: generateCoursePreviewSchema,
      execute: async (params) => {
        logger.info("generateCoursePreview executed", {
          title: params.title,
          moduleCount: params.modules.length,
        });

        return {
          type: "course_preview" as const,
          ...params,
        };
      },
    }),

    createCourse: tool({
      description:
        "Create the final course with all modules. Call this ONLY after the user confirms the preview. Course is created as draft for admin review.",
      inputSchema: createCourseSchema,
      execute: async ({
        title,
        shortDescription,
        description,
        level,
        objectives,
        requirements,
        features,
        moduleIds,
        categoryId,
      }) => {
        const slug = title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const [maxOrder] = await db
          .select({ maxOrder: coursesTable.order })
          .from(coursesTable)
          .where(eq(coursesTable.tenantId, tenantId))
          .orderBy(desc(coursesTable.order))
          .limit(1);

        const nextOrder = (maxOrder?.maxOrder ?? -1) + 1;

        const [course] = await db
          .insert(coursesTable)
          .values({
            tenantId,
            slug,
            title,
            shortDescription,
            description,
            level,
            objectives,
            requirements,
            features,
            status: "draft",
            order: nextOrder,
            price: 0,
            currency: "USD",
            language: "es",
            categoryId: categoryId ?? null,
          })
          .returning();

        if (moduleIds.length > 0) {
          const moduleInserts = moduleIds.map((moduleId, index) => ({
            courseId: course.id,
            moduleId,
            order: index,
          }));

          await db.insert(courseModulesTable).values(moduleInserts);
        }

        let thumbnailKey: string | null = null;
        try {
          const modules = await db
            .select({ title: modulesTable.title })
            .from(modulesTable)
            .where(
              sql`${modulesTable.id} IN (${sql.join(moduleIds.map(id => sql`${id}`), sql`, `)})`
            );

          const topics = modules.slice(0, 5).map((m) => m.title);
          const imagePrompt = THUMBNAIL_GENERATION_PROMPT
            .replace("{{title}}", title)
            .replace("{{description}}", shortDescription)
            .replace("{{topics}}", topics.join(", "));

          logger.info("Generating course thumbnail with AI Gateway");
          const imageStart = Date.now();

          const imageResult = await generateText({
            model: aiGateway(AI_MODELS.IMAGE_GENERATION),
            prompt: imagePrompt,
          });

          const imageTime = Date.now() - imageStart;
          logger.info("Thumbnail generation completed", {
            imageTime: `${imageTime}ms`,
          });

          const imageFile = imageResult.files?.find((f) =>
            f.mediaType.startsWith("image/")
          );

          if (imageFile?.base64) {
            const base64Data = `data:${imageFile.mediaType};base64,${imageFile.base64}`;
            thumbnailKey = await uploadBase64ToS3({
              base64: base64Data,
              folder: `courses/${course.id}`,
              userId: tenantId,
            });

            await db
              .update(coursesTable)
              .set({ thumbnail: thumbnailKey })
              .where(eq(coursesTable.id, course.id));
          }
        } catch (error) {
          logger.warn("Thumbnail generation failed, continuing without thumbnail", {
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        logger.info("createCourse executed", {
          courseId: course.id,
          title: course.title,
          moduleCount: moduleIds.length,
          hasThumbnail: !!thumbnailKey,
        });

        return {
          type: "course_created" as const,
          courseId: course.id,
          title: course.title,
          slug: course.slug,
          modulesCount: moduleIds.length,
          hasThumbnail: !!thumbnailKey,
        };
      },
    }),
  };
}

export type CourseCreatorTools = ReturnType<typeof createCourseCreatorTools>;
