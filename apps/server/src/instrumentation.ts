import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

const isProduction = Bun.env.NODE_ENV === "production";

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  ["langfuse-sdk", "ai"].includes(otelSpan.instrumentationScope.name);

export const langfuseSpanProcessor = isProduction
  ? new LangfuseSpanProcessor({ shouldExportSpan })
  : null;

const sdk = isProduction
  ? new NodeSDK({ spanProcessors: [langfuseSpanProcessor!] })
  : null;

sdk?.start();

export { sdk };
