import { Elysia, t } from "elysia";
import { authPlugin } from "@/plugins/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { withHandler } from "@/lib/handler";
import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { groq } from "@/lib/ai/groq";
import { AI_MODELS } from "@/lib/ai/models";
import { VIDEO_ANALYSIS_PROMPT } from "@/lib/ai/prompts";
import { transcribeVideo } from "@/lib/ai/transcript";
import { getPresignedUrl } from "@/lib/upload";
import { logger } from "@/lib/logger";

export const aiRoutes = new Elysia().use(authPlugin).post(
  "/videos/:id/analyze",
  (ctx) =>
    withHandler(ctx, async () => {
      if (!ctx.user) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Unauthorized", 401);
      }

      if (!ctx.user.tenantId) {
        throw new AppError(
          ErrorCode.TENANT_NOT_FOUND,
          "User has no tenant",
          404
        );
      }

      const canManage =
        ctx.userRole === "owner" ||
        ctx.userRole === "admin" ||
        ctx.userRole === "superadmin";

      if (!canManage) {
        throw new AppError(
          ErrorCode.FORBIDDEN,
          "Only owners and admins can analyze videos",
          403
        );
      }

      const [video] = await db
        .select()
        .from(videosTable)
        .where(
          and(
            eq(videosTable.id, ctx.params.id),
            eq(videosTable.tenantId, ctx.user.tenantId)
          )
        )
        .limit(1);

      if (!video) {
        throw new AppError(ErrorCode.NOT_FOUND, "Video not found", 404);
      }

      if (!video.videoKey) {
        throw new AppError(
          ErrorCode.BAD_REQUEST,
          "Video has no file uploaded",
          400
        );
      }

      const videoUrl = getPresignedUrl(video.videoKey);

      logger.info("Starting video analysis", { videoId: video.id });

      const transcript = await transcribeVideo(videoUrl);

      const contentStart = Date.now();
      const contentResponse = await groq.chat.completions.create({
        model: AI_MODELS.CONTENT_GENERATION,
        messages: [
          { role: "system", content: VIDEO_ANALYSIS_PROMPT },
          { role: "user", content: transcript },
        ],
        max_tokens: 500,
      });
      const contentTime = Date.now() - contentStart;

      const contentText = contentResponse.choices[0]?.message?.content;

      logger.info("Groq content generation completed", {
        videoId: video.id,
        contentTime: `${contentTime}ms`,
      });
      if (!contentText) {
        throw new AppError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "Failed to generate content",
          500
        );
      }

      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "Failed to parse AI response",
          500
        );
      }

      const { title, description } = JSON.parse(jsonMatch[0]) as {
        title: string;
        description: string;
      };

      return { title, description };
    }),
  {
    params: t.Object({
      id: t.String({ format: "uuid" }),
    }),
    detail: {
      tags: ["AI"],
      summary:
        "Analyze video with AI to generate transcript, title, and description",
    },
  }
);
