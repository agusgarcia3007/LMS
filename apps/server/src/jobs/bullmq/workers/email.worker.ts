import { Worker } from "bullmq";
import { connection } from "../connection";
import { db } from "@/db";
import { jobsHistoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { sendEmail } from "@/lib/utils";
import {
  getWelcomeVerificationEmailHtml,
  getTenantWelcomeEmailHtml,
  getFeatureSubmissionEmailHtml,
  getFeatureApprovedEmailHtml,
  getFeatureRejectedEmailHtml,
  getRevenueCatWelcomeEmailHtml,
} from "@/lib/email-templates";
import type {
  SendWelcomeEmailJob,
  SendTenantWelcomeEmailJob,
  SendFeatureSubmissionEmailJob,
  SendFeatureApprovedEmailJob,
  SendFeatureRejectedEmailJob,
  SendRevenueCatWelcomeEmailJob,
} from "../../types";

type EmailJobData = { historyId: string } & (
  | SendWelcomeEmailJob["data"]
  | SendTenantWelcomeEmailJob["data"]
  | SendFeatureSubmissionEmailJob["data"]
  | SendFeatureApprovedEmailJob["data"]
  | SendFeatureRejectedEmailJob["data"]
  | SendRevenueCatWelcomeEmailJob["data"]
);

async function processWelcomeEmail(data: SendWelcomeEmailJob["data"] & { clientUrl: string; verificationToken: string }) {
  const verificationUrl = `${data.clientUrl}/verify-email?token=${data.verificationToken}`;
  await sendEmail({
    to: data.email,
    subject: "Welcome! Please verify your email",
    html: getWelcomeVerificationEmailHtml({
      userName: data.userName,
      verificationUrl,
    }),
  });
}

async function processTenantWelcomeEmail(data: SendTenantWelcomeEmailJob["data"]) {
  await sendEmail({
    to: data.email,
    subject: `Welcome to ${data.tenantName}!`,
    html: getTenantWelcomeEmailHtml({
      userName: data.userName,
      tenantName: data.tenantName,
      dashboardUrl: data.dashboardUrl,
      logoUrl: data.logoUrl,
    }),
  });
}

async function processFeatureSubmissionEmail(data: SendFeatureSubmissionEmailJob["data"]) {
  await sendEmail({
    to: data.email,
    subject: "Thanks for your feature suggestion!",
    html: getFeatureSubmissionEmailHtml({
      userName: data.userName,
      featureTitle: data.featureTitle,
    }),
  });
}

async function processFeatureApprovedEmail(data: SendFeatureApprovedEmailJob["data"]) {
  await sendEmail({
    to: data.email,
    subject: "We're shipping your feature!",
    html: getFeatureApprovedEmailHtml({
      userName: data.userName,
      featureTitle: data.featureTitle,
      featuresUrl: data.featuresUrl,
    }),
  });
}

async function processFeatureRejectedEmail(data: SendFeatureRejectedEmailJob["data"]) {
  await sendEmail({
    to: data.email,
    subject: "Update on your feature suggestion",
    html: getFeatureRejectedEmailHtml({
      userName: data.userName,
      featureTitle: data.featureTitle,
      rejectionReason: data.rejectionReason,
    }),
  });
}

async function processRevenueCatWelcomeEmail(data: SendRevenueCatWelcomeEmailJob["data"]) {
  await sendEmail({
    to: data.email,
    subject: `Welcome to ${data.tenantName}`,
    html: getRevenueCatWelcomeEmailHtml({
      recipientName: data.email.split("@")[0],
      tenantName: data.tenantName,
      resetUrl: data.resetUrl,
      logoUrl: data.tenantLogo ?? undefined,
    }),
    senderName: data.tenantName,
    replyTo: data.tenantContactEmail ?? undefined,
  });
}

export const emailWorker = new Worker<EmailJobData>(
  "emails",
  async (job) => {
    const { historyId } = job.data;

    if (historyId) {
      await db
        .update(jobsHistoryTable)
        .set({ status: "processing", startedAt: new Date() })
        .where(eq(jobsHistoryTable.id, historyId));
    }

    switch (job.name) {
      case "send-welcome-email":
        return await processWelcomeEmail(job.data as SendWelcomeEmailJob["data"]);
      case "send-tenant-welcome-email":
        return await processTenantWelcomeEmail(job.data as SendTenantWelcomeEmailJob["data"]);
      case "send-feature-submission-email":
        return await processFeatureSubmissionEmail(job.data as SendFeatureSubmissionEmailJob["data"]);
      case "send-feature-approved-email":
        return await processFeatureApprovedEmail(job.data as SendFeatureApprovedEmailJob["data"]);
      case "send-feature-rejected-email":
        return await processFeatureRejectedEmail(job.data as SendFeatureRejectedEmailJob["data"]);
      case "send-revenuecat-welcome-email":
        return await processRevenueCatWelcomeEmail(job.data as SendRevenueCatWelcomeEmailJob["data"]);
      default:
        throw new Error(`Unknown email job: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", async (job) => {
  const historyId = job.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.info("Email job completed", { name: job.name, id: job.id });
});

emailWorker.on("failed", async (job, error) => {
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
  logger.error("Email job failed", { name: job?.name, error: error.message });
});
