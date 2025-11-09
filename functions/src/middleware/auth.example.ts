import {Request, Response, NextFunction} from "express";
import * as admin from "firebase-admin";
import {ApiError} from "./errorHandler";
import {ApiRequest} from "../types";

/**
 * Extended request interface with user information
 */
export interface AuthenticatedRequest extends ApiRequest {
  user?: admin.auth.DecodedIdToken;
}

/**
 * Authentication middleware
 * Verifies Firebase Auth ID token from Authorization header
 *
 * Usage:
 * import {requireAuth} from "./middleware/auth";
 *
 * router.post("/protected", requireAuth, handler);
 */
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = decodedToken;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, "Invalid or expired token"));
    }
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is provided, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};

/**
 * Role-based authorization middleware
 * Requires authentication first
 *
 * Usage:
 * router.post(
 *   "/admin-only",
 *   requireAuth,
 *   requireRole(["admin"]),
 *   handler
 * );
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      // Check custom claims for role
      const userRole = req.user.role as string | undefined;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          "Insufficient permissions. Required roles: " + allowedRoles.join(", ")
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns the resource
 * Useful for user-specific endpoints
 *
 * Usage:
 * router.get(
 *   "/users/:userId",
 *   requireAuth,
 *   requireOwnership("userId"),
 *   handler
 * );
 */
export const requireOwnership = (userIdParam = "userId") => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      const requestedUserId = req.params[userIdParam];
      const authenticatedUserId = req.user.uid;

      // Check if user is requesting their own data or is admin
      const isAdmin = req.user.role === "admin";
      const isOwner = requestedUserId === authenticatedUserId;

      if (!isOwner && !isAdmin) {
        throw new ApiError(
          403,
          "You can only access your own resources"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limiting middleware (simple in-memory implementation)
 * For production, use Redis or similar
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || "unknown";
    const now = Date.now();

    let record = requestCounts.get(identifier);

    // Reset if window has passed
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
      requestCounts.set(identifier, record);
    }

    record.count++;

    // Check if limit exceeded
    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter.toString());
      return res.status(429).json({
        success: false,
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      });
    }

    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", (maxRequests - record.count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(record.resetTime).toISOString());

    next();
  };
};

/**
 * API Key authentication (alternative to Firebase Auth)
 * Useful for server-to-server communication
 */
export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;

  // Store API keys in environment variables or database
  const validApiKeys = process.env.API_KEYS?.split(",") || [];

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: "Invalid API key",
    });
  }

  next();
};

