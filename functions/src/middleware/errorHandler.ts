import {Request, Response, NextFunction} from "express";
import {ZodError} from "zod";
import {ApiResponse} from "../types";
import * as logger from "firebase-functions/logger";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error handler middleware
 * Catches all errors and formats them into a standard response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  const response: ApiResponse = {
    success: false,
  };

  // Log error details
  logger.error("API Error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle different error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    response.error = message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    response.error = message;
    response.errors = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));
  } else {
    // Generic error
    response.error = message;
    // Only show detailed error in development
    if (process.env.NODE_ENV === "development") {
      response.message = err.message;
    }
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const response: ApiResponse = {
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
  };
  res.status(404).json(response);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

