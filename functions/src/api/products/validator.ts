import {z} from "zod";

/**
 * Schema for creating a new product
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    category: z.string().min(1, "Category is required"),
    stock: z.number().int().nonnegative("Stock must be non-negative").default(0),
    isActive: z.boolean().default(true),
  }),
});

/**
 * Schema for updating a product
 */
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Schema for getting a product by ID
 */
export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

/**
 * Schema for deleting a product
 */
export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

/**
 * Schema for listing products with pagination and filters
 */
export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
    category: z.string().optional(),
    isActive: z.string().transform((val) => val === "true").optional(),
    search: z.string().optional(),
  }),
});

// Type exports for use in controllers and services
export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type ListProductsQuery = z.infer<typeof listProductsSchema>["query"];

