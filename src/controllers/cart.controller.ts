import { Response, NextFunction } from "express";
import { CustomError } from "../utils/errors/CustomError";
import { AuthRequest } from "../types/auth.types";
import { getPagination } from "../utils/pagination";
import sequelize from "../config/database";
import Cart from "../../sequelize/models/cart";
import CartItem from "../../sequelize/models/cartItem";
import User from "../../sequelize/models/user";
import CartMember from "../../sequelize/models/cartMember";
import { CartAttributes } from "../types/cart.types";

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
  // Remember to adjust the response format
  try {
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { title } = req.body;
    if (!title) throw new CustomError("Title is required", 400);

    let cart: CartAttributes | null = null;
    await sequelize.transaction(async (transaction) => {
      cart = await Cart.createEmptyCart(title, userId, transaction);
      await CartMember.addMemberToCart(cart.id, userId, true, transaction);
    });
    if (!cart) throw new CustomError("Cart creation failed", 500);

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
      await CartMember.addMemberToCart(newCartId, userId, true, transaction);
    });

    if (!newCartId) throw new CustomError("Cart creation failed", 500);
    const cartDetails = await Cart.getFullyCartDetails(newCartId);

    res.status(201).json(cartDetails);
  } catch (error) {
    next(error);
  }
};

export const deleteCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const cart = await Cart.findByPk(id);
    if (!cart) throw new CustomError("Cart not found", 404);

    await cart.destroy();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addCartMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { newMemberId } = req.body;
    if (!newMemberId) throw new CustomError("Member ID is required", 400);

    const cart = await Cart.findByPk(id);
    if (!cart) throw new CustomError("Cart not found", 404);

    const newMember = await User.findByPk(newMemberId);
    if (!newMember) throw new CustomError("Member not found", 404);

    await CartMember.addMemberToCart(cart.id, newMemberId, false);

    res.status(200).json({ message: "Member added to cart successfully" });
  } catch (error) {
    console.log("Error adding cart member", error);
    next(error);
  }
};
