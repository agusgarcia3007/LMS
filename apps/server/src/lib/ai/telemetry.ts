import { propagateAttributes } from "@langfuse/tracing";

export interface TelemetryContext {
  userId: string;
  tenantId: string;
  operationName: string;
  metadata?: Record<string, string>;
}

export function createTelemetryConfig(functionId: string) {
  return {
    experimental_telemetry: {
      isEnabled: true,
      functionId,
    },
  };
}

export async function withUserContext<T>(
  context: TelemetryContext,
  callback: () => Promise<T>
): Promise<T> {
  return propagateAttributes(
    {
      userId: context.userId,
      sessionId: context.tenantId,
      metadata: {
        tenantId: context.tenantId,
        operation: context.operationName,
        ...context.metadata,
      },
    },
    callback
  );
}
