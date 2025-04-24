import { Request, Response, NextFunction } from "express";
import Cart from "../../sequelize/models/cart";
import { CustomError } from "../utils/errors/CustomError";
import { AuthRequest } from "../types/auth.types";
import { getPagination } from "../utils/pagination";
import sequelize from "../config/database";
import CartItem from "../../sequelize/models/cartItem";
import { CreateCartItemProductsI } from "src/types/cartItem.types";
import { CartAttributes } from "src/types/cart.types";

/**
/**
 * Get all carts for the authenticated user
 * @route GET /api/carts
 */
export const getUserCarts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // The user ID should be available from the auth middleware
    const userId = req.userId;
    const { page = 1, size = 5 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));

    // Find all carts for this user
    const carts = await Cart.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching user carts:", error);
    next(error);
  }
};

export const getCartById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const cart = await Cart.getFullyCartDetails(Number(id));
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const createEmptyCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { title } = req.body;
    if (!title) throw new CustomError("Title is required", 400);

    const cart = await Cart.createEmptyCart(title, userId);

    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const createCartWithProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { title, products } = req.body;
    if (!title || !products || !products.length)
      throw new CustomError("Title and products are required", 400);

    let newCartId: number | null = null;

    await sequelize.transaction(async (transaction) => {
      const newCart = await Cart.createEmptyCart(title, userId, transaction);
      newCartId = newCart.id;
      const cartItems = await CartItem.generateCartItemsFromProducts(
        newCartId,
        products,
        transaction
      );
    });

    if (!newCartId) throw new CustomError("Cart creation failed", 500);
    const cartDetails = await Cart.getFullyCartDetails(newCartId);

    res.status(201).json(cartDetails);
  } catch (error) {
    next(error);
  }
};
