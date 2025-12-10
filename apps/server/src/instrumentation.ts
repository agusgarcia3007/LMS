import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  ["langfuse-sdk", "ai"].includes(otelSpan.instrumentationScope.name);

export const langfuseSpanProcessor = new LangfuseSpanProcessor({
  shouldExportSpan,
});

const sdk = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});

sdk.start();

export { sdk };
