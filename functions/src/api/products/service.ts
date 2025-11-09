import * as admin from "firebase-admin";
import {ApiError} from "../../middleware/errorHandler";
import {CreateProductInput, UpdateProductInput, ListProductsQuery} from "./validator";
import * as logger from "firebase-functions/logger";

/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

/**
 * Product Service - handles all business logic for products
 */
export class ProductService {
  private db: admin.firestore.Firestore;
  private collection: admin.firestore.CollectionReference;

  constructor() {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    this.db = admin.firestore();
    this.collection = this.db.collection("products");
  }

  /**
   * Create a new product
   */
  async create(data: CreateProductInput): Promise<Product> {
    try {
      const now = admin.firestore.Timestamp.now();
      const productData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.collection.add(productData);
      const doc = await docRef.get();

      logger.info("Product created", {productId: docRef.id});

      return {
        id: docRef.id,
        ...doc.data(),
      } as Product;
    } catch (error) {
      logger.error("Error creating product", {error});
      throw new ApiError(500, "Failed to create product");
    }
  }

  /**
   * Get all products with pagination and filters
   */
  async findAll(query: ListProductsQuery): Promise<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const {page = 1, limit = 10, category, isActive, search} = query;
      let firestoreQuery: admin.firestore.Query = this.collection;

      // Apply filters
      if (category) {
        firestoreQuery = firestoreQuery.where("category", "==", category);
      }

      if (isActive !== undefined) {
        firestoreQuery = firestoreQuery.where("isActive", "==", isActive);
      }

      // Note: Full-text search is limited in Firestore
      // For production, consider using Algolia or Elasticsearch
      if (search) {
        // This is a simple name-based search
        // For better search, use a dedicated search service
        firestoreQuery = firestoreQuery
          .orderBy("name")
          .startAt(search)
          .endAt(search + "\uf8ff");
      } else {
        firestoreQuery = firestoreQuery.orderBy("createdAt", "desc");
      }

      // Get total count (for pagination)
      const totalSnapshot = await firestoreQuery.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedQuery = firestoreQuery.limit(limit).offset(offset);
      const snapshot = await paginatedQuery.get();

      const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Error fetching products", {error});
      throw new ApiError(500, "Failed to fetch products");
    }
  }

  /**
   * Get a product by ID
   */
  async findById(id: string): Promise<Product> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new ApiError(404, "Product not found");
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as Product;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error("Error fetching product", {productId: id, error});
      throw new ApiError(500, "Failed to fetch product");
    }
  }

  /**
   * Update a product
   */
  async update(id: string, data: UpdateProductInput): Promise<Product> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Product not found");
      }

      const updateData = {
        ...data,
        updatedAt: admin.firestore.Timestamp.now(),
      };

      await docRef.update(updateData);
      const updatedDoc = await docRef.get();

      logger.info("Product updated", {productId: id});

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as Product;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error("Error updating product", {productId: id, error});
      throw new ApiError(500, "Failed to update product");
    }
  }

  /**
   * Delete a product (soft delete by setting isActive to false)
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Product not found");
      }

      // Soft delete
      await docRef.update({
        isActive: false,
        updatedAt: admin.firestore.Timestamp.now(),
      });

      logger.info("Product deleted (soft)", {productId: id});

      // For hard delete, use: await docRef.delete();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error("Error deleting product", {productId: id, error});
      throw new ApiError(500, "Failed to delete product");
    }
  }

  /**
   * Hard delete a product (permanently remove from database)
   */
  async hardDelete(id: string): Promise<void> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Product not found");
      }

      await docRef.delete();

      logger.info("Product deleted (hard)", {productId: id});
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error("Error hard deleting product", {productId: id, error});
      throw new ApiError(500, "Failed to delete product");
    }
  }
}

