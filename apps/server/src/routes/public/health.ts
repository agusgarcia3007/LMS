import { Elysia } from "elysia";

export const healthRoutes = new Elysia({ name: "health" }).get(
  "/",
  () => ({ status: "ok" }),
  {
    detail: {
      tags: ["Health"],
      summary: "Health check endpoint",
    },
  }
);
