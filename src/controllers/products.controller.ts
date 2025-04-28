import { NextFunction, Request, Response } from "express";
import Product from "../db/models/product";
import Category from "../db/models/category";
import ProductPrice from "../db/models/productPrice";
import Supermarket from "../db/models/supermarket";
import { CustomError } from "../utils/errors/CustomError";
import {
  buildProductQuery,
  transformProductToFullDetails,
} from "../helpers/product.helpers";
import { JoinedProductDetails } from "src/types/product.types";

/**
 * Get all products
 * @route GET /api/products
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get query options from helper
    const queryOptions = buildProductQuery(req.query);

    const products = await Product.findAll(queryOptions);
    const response = products.map((p) =>
      transformProductToFullDetails(
        p.toJSON() as unknown as JoinedProductDetails
      )
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

export const countProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryOptions = buildProductQuery(req.query);
    const { where, include, distinct } = queryOptions;

    const count = await Product.count({
      where,
      include,
      distinct,
    });
    res.status(200).json(count);
  } catch (error) {
    console.log("Error in countProducts", error);
    next(error);
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: ProductPrice,
          include: [
            {
              model: Supermarket,
              attributes: ["id", "name", "brand_img"],
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    const response = transformProductToFullDetails(
      product.toJSON() as unknown as JoinedProductDetails
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product:", error);
    next(error);
  }
};
