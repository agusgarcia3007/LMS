import { Elysia, t } from "elysia";
import { db } from "@/db";
import { waitlistTable } from "@/db/schema";
import { withHandler } from "@/lib/handler";

export const waitlistRoutes = new Elysia({ name: "waitlist" }).post(
  "/",
  (ctx) =>
    withHandler(ctx, async () => {
      const [entry] = await db
        .insert(waitlistTable)
        .values({ email: ctx.body.email })
        .onConflictDoNothing({ target: waitlistTable.email })
        .returning();

      return { success: true, isNew: !!entry };
    }),
  {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
    detail: {
      tags: ["Waitlist"],
      summary: "Join the waitlist",
    },
  }
);
