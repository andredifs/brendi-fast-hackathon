import {Response} from "express";
import {ApiRequest, ApiResponse, PaginatedResponse} from "../../types";
import {ProductService, Product} from "./service";
import {CreateProductInput, UpdateProductInput, ListProductsQuery} from "./validator";
import * as logger from "firebase-functions/logger";

/**
 * Product Controller - handles HTTP requests and responses
 */
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Create a new product
   * POST /api/products
   */
  create = async (
    req: ApiRequest<CreateProductInput>,
    res: Response
  ): Promise<Response> => {
    logger.info("Creating product", {body: req.body});

    const product = await this.productService.create(req.body);

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: "Product created successfully",
    };

    return res.status(201).json(response);
  };

  /**
   * Get all products with pagination and filters
   * GET /api/products
   */
  findAll = async (
    req: ApiRequest<any, ListProductsQuery>,
    res: Response
  ): Promise<Response> => {
    logger.info("Fetching products", {query: req.query});

    const result = await this.productService.findAll(req.query);

    const response: PaginatedResponse<Product> = {
      success: true,
      data: result.products,
      pagination: result.pagination,
    };

    return res.status(200).json(response);
  };

  /**
   * Get a product by ID
   * GET /api/products/:id
   */
  findById = async (
    req: ApiRequest<any, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    logger.info("Fetching product by ID", {id: req.params.id});

    const product = await this.productService.findById(req.params.id);

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    };

    return res.status(200).json(response);
  };

  /**
   * Update a product
   * PUT /api/products/:id
   */
  update = async (
    req: ApiRequest<UpdateProductInput, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    logger.info("Updating product", {id: req.params.id, body: req.body});

    const product = await this.productService.update(req.params.id, req.body);

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: "Product updated successfully",
    };

    return res.status(200).json(response);
  };

  /**
   * Delete a product (soft delete)
   * DELETE /api/products/:id
   */
  delete = async (
    req: ApiRequest<any, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    logger.info("Deleting product", {id: req.params.id});

    await this.productService.delete(req.params.id);

    const response: ApiResponse = {
      success: true,
      message: "Product deleted successfully",
    };

    return res.status(200).json(response);
  };

  /**
   * Hard delete a product (permanently remove)
   * DELETE /api/products/:id/hard
   */
  hardDelete = async (
    req: ApiRequest<any, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    logger.info("Hard deleting product", {id: req.params.id});

    await this.productService.hardDelete(req.params.id);

    const response: ApiResponse = {
      success: true,
      message: "Product permanently deleted",
    };

    return res.status(200).json(response);
  };
}

