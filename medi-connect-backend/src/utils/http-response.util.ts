import type { Response } from "express";

import { ServiceError, type ServiceErrorCode } from "./service-error.util.js";

const serviceErrorStatus: Record<ServiceErrorCode, number> = {
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 403,
  INVALID_INPUT: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

export const sendControllerError = (
  res: Response,
  error: unknown,
  logMessage: string
) => {
  if (error instanceof ServiceError) {
    res.status(serviceErrorStatus[error.code]).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error(logMessage, error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
