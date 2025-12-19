import { Elysia } from "elysia";
import { logger } from "./logger";
import { ErrorCode, type ErrorResponse } from "@learnbase/core";

export { ErrorCode, type ErrorResponse } from "@learnbase/core";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  { as: "global" },
  ({ error, set, code, path }) => {
    logger.error(`[${path}] Error`, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
              cause: error.cause,
            }
          : error,
      code,
    });

    if (error instanceof AppError || (error instanceof Error && error.name === "AppError")) {
      const appError = error as AppError;
      set.status = appError.statusCode;
      return {
        code: appError.code,
        message: appError.message,
      } satisfies ErrorResponse;
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        code: ErrorCode.VALIDATION_ERROR,
        message: error instanceof Error ? error.message : "Validation failed",
      } satisfies ErrorResponse;
    }

    if (error instanceof Error && error.message?.includes("violates")) {
      set.status = 409;
      return {
        code: ErrorCode.DATABASE_ERROR,
        message: "Database constraint violation",
      } satisfies ErrorResponse;
    }

    logger.error("Unhandled error", { error: error instanceof Error ? error.message : String(error) });
    set.status = 500;
    return {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
    } satisfies ErrorResponse;
  }
);
