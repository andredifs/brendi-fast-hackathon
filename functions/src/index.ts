/**
 * Firebase Cloud Functions with Express API
 *
 * This is a template for a CRUD API using:
 * - Express: Web framework
 * - Zod: Schema validation
 * - Layered architecture: Controller, Service, Validator
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express, {Express} from "express";
import {errorHandler, notFoundHandler} from "./middleware/errorHandler";
import {productRoutes} from "./api/products/routes";

/**
 * Create and configure Express app
 */
const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // Request logging
  app.use((req, res, next) => {
    logger.info("Incoming request", {
      method: req.method,
      path: req.path,
      query: req.query,
    });
    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use("/api/products", productRoutes);

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

/**
 * Main API Cloud Function
 * Deployed as: https://<region>-<project-id>.cloudfunctions.net/api
 */
export const api = onRequest({
  cors: true, // Enable CORS for all origins (configure as needed)
  maxInstances: 10,
  timeoutSeconds: 60,
}, createApp());

/**
 * Example: Keep the hello world function for testing
 * Can be removed in production
 */
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({result: "Hello from Firebase!"});
});
