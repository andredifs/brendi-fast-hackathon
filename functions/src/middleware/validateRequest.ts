import {Request, Response, NextFunction} from "express";
import {AnyZodObject, ZodError} from "zod";
import {ApiRequest} from "../types";

/**
 * Middleware to validate request data using Zod schemas
 * @param schema - Zod schema object with optional body, query, and params
 */
export const validateRequest = (schema: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return async (req: ApiRequest, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      // Validate query parameters
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      // Validate URL parameters
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};

