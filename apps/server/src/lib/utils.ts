import { Resend } from "resend";
import { env } from "./env";
import { CLIENT_URL, SITE_DATA } from "./constants";
import { logger } from "./logger";
import type { SelectTenant } from "@/db/schema";

export function parseDuration(durationMs: number) {
  if (isNaN(durationMs)) return null;
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  } else if (durationMs >= 1) {
    return `${durationMs.toFixed(2)}ms`;
  } else {
    return `${(durationMs * 1000).toFixed(2)}µs`;
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  senderName,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  senderName?: string;
  replyTo?: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY!);
  const { data, error } = await resend.emails.send({
    from: `${senderName || SITE_DATA.NAME} <${SITE_DATA.EMAIL}>`,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    logger.error("Error sending email", { error: error.message });
  }
  return data;
}

export function getTenantClientUrl(tenant: SelectTenant | null): string {
  if (!tenant) return CLIENT_URL;

  if (tenant.customDomain) {
    return `https://${tenant.customDomain}`;
  }

  return `https://${tenant.slug}.${env.BASE_DOMAIN}`;
}
