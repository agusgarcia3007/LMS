import { Hono } from "hono";
import { getS3Object, type Env } from "./s3";

const app = new Hono<{ Bindings: Env }>();

app.get("/*", async (c) => {
  const key = c.req.path.slice(1);

  if (!key) {
    return c.text("Not found", 404);
  }

  const cache = caches.default;
  const cacheKey = new Request(c.req.url.split("?")[0]);

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  const rangeHeader = c.req.header("range");
  const s3Response = await getS3Object(key, c.env, rangeHeader);

  if (!s3Response.ok && s3Response.status !== 206) {
    return c.text("Not found", 404);
  }

  const headers = new Headers({
    "Content-Type":
      s3Response.headers.get("Content-Type") || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  });

  const contentLength = s3Response.headers.get("Content-Length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  const contentRange = s3Response.headers.get("Content-Range");
  if (contentRange) {
    headers.set("Content-Range", contentRange);
  }

  const response = new Response(s3Response.body, {
    status: s3Response.status,
    headers,
  });

  if (s3Response.status === 200) {
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
});

export default app;
