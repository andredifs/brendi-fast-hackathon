import {Router} from "express";
import {ProductController} from "./controller";
import {validateRequest} from "../../middleware/validateRequest";
import {asyncHandler} from "../../middleware/errorHandler";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  deleteProductSchema,
  listProductsSchema,
} from "./validator";

/**
 * Product routes
 */
export const productRoutes = Router();
const controller = new ProductController();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (add authentication middleware as needed)
 */
productRoutes.post(
  "/",
  validateRequest(createProductSchema),
  asyncHandler(controller.create)
);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Public
 */
productRoutes.get(
  "/",
  validateRequest(listProductsSchema),
  asyncHandler(controller.findAll)
);

/**
 * @route   GET /api/products/:id
 * @desc    Get a product by ID
 * @access  Public
 */
productRoutes.get(
  "/:id",
  validateRequest(getProductByIdSchema),
  asyncHandler(controller.findById)
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Public (add authentication middleware as needed)
 */
productRoutes.put(
  "/:id",
  validateRequest(updateProductSchema),
  asyncHandler(controller.update)
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (soft delete)
 * @access  Public (add authentication middleware as needed)
 */
productRoutes.delete(
  "/:id",
  validateRequest(deleteProductSchema),
  asyncHandler(controller.delete)
);

/**
 * @route   DELETE /api/products/:id/hard
 * @desc    Permanently delete a product
 * @access  Public (add authentication middleware as needed)
 */
productRoutes.delete(
  "/:id/hard",
  validateRequest(deleteProductSchema),
  asyncHandler(controller.hardDelete)
);

