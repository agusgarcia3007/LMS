import { Worker } from "bullmq";
import { connection } from "../connection";
import { db } from "@/db";
import { jobsHistoryTable, tenantsTable, tenantCustomersTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import type {
  CreateStripeCustomerJob,
  CreateConnectedCustomerJob,
  SyncConnectedCustomerJob,
} from "../../types";

type StripeJobData = { historyId: string } & (
  | CreateStripeCustomerJob["data"]
  | CreateConnectedCustomerJob["data"]
  | SyncConnectedCustomerJob["data"]
);

async function processStripeCustomer(data: CreateStripeCustomerJob["data"]) {
  if (!stripe || !isStripeConfigured()) return;

  const customer = await stripe.customers.create({
    email: data.email,
    name: data.name,
    metadata: { tenantId: data.tenantId, slug: data.slug },
  });

  await db
    .update(tenantsTable)
    .set({
      stripeCustomerId: customer.id,
      plan: "starter",
      subscriptionStatus: "trialing",
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })
    .where(eq(tenantsTable.id, data.tenantId));
}

async function processCreateConnectedCustomer(data: CreateConnectedCustomerJob["data"]) {
  if (!stripe || !isStripeConfigured()) return;

  const [existing] = await db
    .select()
    .from(tenantCustomersTable)
    .where(
      and(
        eq(tenantCustomersTable.tenantId, data.tenantId),
        eq(tenantCustomersTable.userId, data.userId)
      )
    )
    .limit(1);

  if (existing) return;

  const customer = await stripe.customers.create(
    {
      email: data.email,
      name: data.name,
      metadata: { userId: data.userId, platform: "learnbase" },
    },
    { stripeAccount: data.stripeConnectAccountId }
  );

  await db.insert(tenantCustomersTable).values({
    tenantId: data.tenantId,
    userId: data.userId,
    stripeCustomerId: customer.id,
  });
}

async function processSyncConnectedCustomer(data: SyncConnectedCustomerJob["data"]) {
  if (!stripe || !isStripeConfigured()) return;

  const tenantCustomers = await db
    .select({
      stripeCustomerId: tenantCustomersTable.stripeCustomerId,
      stripeConnectAccountId: tenantsTable.stripeConnectAccountId,
    })
    .from(tenantCustomersTable)
    .innerJoin(tenantsTable, eq(tenantCustomersTable.tenantId, tenantsTable.id))
    .where(eq(tenantCustomersTable.userId, data.userId));

  await Promise.all(
    tenantCustomers
      .filter((tc) => tc.stripeConnectAccountId)
      .map((tc) =>
        stripe!.customers.update(
          tc.stripeCustomerId,
          { email: data.email, name: data.name },
          { stripeAccount: tc.stripeConnectAccountId! }
        )
      )
  );
}

export const stripeWorker = new Worker<StripeJobData>(
  "stripe",
  async (job) => {
    const { historyId } = job.data;

    if (historyId) {
      await db
        .update(jobsHistoryTable)
        .set({ status: "processing", startedAt: new Date() })
        .where(eq(jobsHistoryTable.id, historyId));
    }

    switch (job.name) {
      case "create-stripe-customer":
        return await processStripeCustomer(job.data as CreateStripeCustomerJob["data"]);
      case "create-connected-customer":
        return await processCreateConnectedCustomer(job.data as CreateConnectedCustomerJob["data"]);
      case "sync-connected-customer":
        return await processSyncConnectedCustomer(job.data as SyncConnectedCustomerJob["data"]);
      default:
        throw new Error(`Unknown stripe job: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

stripeWorker.on("completed", async (job) => {
  const historyId = job.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.info("Stripe job completed", { name: job.name, id: job.id });
});

stripeWorker.on("failed", async (job, error) => {
  const historyId = job?.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        errorMessage: error.message,
      })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.error("Stripe job failed", { name: job?.name, error: error.message });
});
