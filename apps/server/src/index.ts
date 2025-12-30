import "./instrumentation";

import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { startWorker, stopWorker, bullBoardPlugin } from "./jobs";
import { corsPlugin } from "./lib/cors";
import { env } from "./lib/env";
import { errorHandler } from "./lib/errors";
import { logger } from "./lib/logger";
import { parseDuration } from "./lib/utils";
import { ROUTES } from "./routes";

const app = new Elysia({
  aot: true,
  precompile: true,
  nativeStaticResponse: true,
})
  .use(errorHandler)
  .use(corsPlugin)
  .use(
    rateLimit({
      max: 100,
      duration: 60_000,
      generator: (req) => {
        const forwarded = req.headers.get("x-forwarded-for");
        if (forwarded) return forwarded.split(",")[0].trim();
        const realIp = req.headers.get("x-real-ip");
        if (realIp) return realIp;
        return "unknown";
      },
    })
  )
  .use(
    openapi({
      documentation: {
        info: {
          title: "Learnbase API",
          version: "1.0.0",
          description: "Multi-tenant Learning Management System API",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Profile", description: "User profile management" },
          {
            name: "Tenants",
            description: "Tenant management (superadmin only)",
          },
        ],
      },
    })
  )
  .derive(() => ({ startTime: performance.now() }))
  .onAfterResponse(({ request, startTime, set }) => {
    const duration = performance.now() - startTime;
    const statusCode = set.status;

    if (duration > 1000) {
      logger.warn(
        `SLOW ${request.method} ${request.url} ${parseDuration(
          duration
        )} ${statusCode}`
      );
    } else {
      logger.info(
        `${request.method} ${request.url} ${parseDuration(
          duration
        )} ${statusCode}`
      );
    }
  })
  .get("/", { message: "Learnbase API", version: "1.0.0" })
  .get("/favicon.ico", async () => {
    const favicon = Bun.file("./public/favicon.ico");
    return new Response(favicon, {
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  });

ROUTES.forEach(({ path, route }) => {
  app.group(path, (app) => app.use(route));
});

app.use(bullBoardPlugin);

app.listen({
  port: env.PORT,
  maxRequestBodySize: 2 * 1024 * 1024 * 1024,
});

console.log(
  `📚 Learnbase API running at ${app.server?.hostname}:${app.server?.port}`
);

startWorker();

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down...`);
  app.server?.stop();
  stopWorker();

  try {
    const { langfuseSpanProcessor, sdk } = await import("./instrumentation");
    await langfuseSpanProcessor?.forceFlush();
    await sdk?.shutdown();
    if (sdk) logger.info("Langfuse spans flushed");
  } catch (error) {
    logger.error("Shutdown error", { error });
  }

  logger.forceFlush();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
