import { NextFunction, Request, Response } from "express";
import Product from "../../sequelize/models/product";
import Category from "../../sequelize/models/category";
import ProductPrice from "../../sequelize/models/productPrice";
import Supermarket from "../../sequelize/models/supermarket";
import { CustomError } from "../utils/errors/CustomError";
import { buildProductQuery } from "../helpers/product.helpers";

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

    // Use the options directly in findAll
    const products = await Product.findAll(queryOptions);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    next(error);
  }
};
