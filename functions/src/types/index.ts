import {Request, Response, NextFunction} from "express";

/**
 * Custom Request interface that extends Express Request
 * Can be extended with additional properties as needed
 */
export interface ApiRequest<TBody = any, TQuery = any, TParams = any>
  extends Request<TParams, any, TBody, TQuery> {
  validatedData?: any;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Async controller handler type
 */
export type AsyncHandler = (
  req: ApiRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

