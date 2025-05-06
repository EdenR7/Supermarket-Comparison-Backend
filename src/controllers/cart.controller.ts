import { Response, NextFunction } from "express";
import { CustomError } from "../utils/errors/CustomError";
import { AuthRequest } from "../types/auth.types";
import { getPagination } from "../utils/pagination";
import db from "../db/models";
import sequelize from "../config/database";
import { CartAttributes } from "../types/cart.types";
import { cartAdminAction } from "../utils/cart.utils";
const { Cart, CartMember, User, CartItem, Product } = db;

/**
/**
 * Get all carts for the authenticated user
 * @route GET /api/carts
 */
export const getUserSavedCarts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // The user ID should be available from the auth middleware
    const { userId } = req;
    const { page = 1, size = 5 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));

    // Find all carts where the user is a member
    const carts = await Cart.getUserSavedCarts(userId!, limit, offset);

    res.status(200).json(carts);
  } catch (error) {
    console.log("Error in getUserSavedCarts controller", error);
    next(error);
  }
};

export const getUserMainCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const userMainCart = await Cart.getMainCart(userId);
    if (!userMainCart) throw new CustomError("Main cart not found", 404);
    res.status(200).json(userMainCart);
  } catch (error) {
    console.log("Error in getUserMainCart controller", error);
    next(error);
  }
};

export const countUserCarts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const count = await Cart.count({
    include: [
      // First include to get all cart members
      {
        model: CartMember,
        include: [
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
        ],
      },
      {
        model: CartMember,
        where: { user_id: userId },
        required: true, // Makes it an INNER JOIN
        attributes: [],
      },
    ],
  });

  res.status(200).json(count);
  try {
  } catch (error) {
    console.log("Error in countUserCarts", error);
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

    const cart = await Cart.getCartWithItems(Number(id));
    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in getCartById", error);
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
      const cart = await Cart.createEmptyCart(
        title,
        userId,
        "saved",
        transaction
      );
      await CartMember.addMemberToCart(cart.id, userId, true, transaction);
    });
    if (!cart) throw new CustomError("Cart creation failed", 500);

    res.status(201).json(cart);
  } catch (error) {
    console.log("Error in createEmptyCart", error);
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
      const newCart = await Cart.createEmptyCart(
        title,
        userId,
        "saved",
        transaction
      );
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
    console.log("Error in createCartWithProducts", error);
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

    // only the creator can delete the cart
    if (cart.user_id !== userId)
      throw new CustomError("You are not authorized to delete this cart", 403);

    await cart.destroy();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCart", error);
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

    await cartAdminAction(cart.id, userId, async () => {
      await CartMember.addMemberToCart(cart.id, newMemberId, false);
    });

    res.status(200).json({ message: "Member added to cart successfully" });
  } catch (error) {
    console.log("Error in addCartMember", error);
    next(error);
  }
};

export const removeCartMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { userIdToRemove } = req.body;
    if (!userIdToRemove)
      throw new CustomError("userIdToRemove is required", 400);

    const cart = await Cart.findByPk(id);
    if (!cart) throw new CustomError("Cart not found", 404);

    const member = await CartMember.findOne({
      where: { cart_id: cart.id, user_id: userIdToRemove },
    });
    if (!member) throw new CustomError("Member not found", 404);

    await cartAdminAction(cart.id, userId, async () => {
      await CartMember.removeMemberFromCart(cart.id, userIdToRemove);
    });

    res.status(200).json({ message: "Member removed from cart successfully" });
  } catch (error) {
    console.log("Error in removeCartMember", error);
    next(error);
  }
};

export const addCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const { productId, quantity = 1 } = req.body;
    if (!productId) throw new CustomError("Product ID is required", 400);

    const cart = await Cart.findByPk(id);
    if (!cart) throw new CustomError("Cart not found", 404);

    const product = await Product.findByPk(productId);
    if (!product) throw new CustomError("Product not found", 404);

    const cartItem = await CartItem.create({
      cart_id: cart.id,
      product_id: productId,
      quantity,
    });

    const response = {
      id: cartItem.id,
      quantity: cartItem.quantity,
      product: {
        id: product.id,
        name: product.name,
        img_url: product.img_url,
        category_id: product.category_id,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Error in addCartItem", error);
    next(error);
  }
};

// Need to finish this
export const copySavedCartToMain = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { savedCartId } = req.params;
    const { userId } = req;
    if (!userId) throw new CustomError("User not authenticated", 401);

    const savedCart = await Cart.findByPk(savedCartId);
    if (!savedCart) throw new CustomError("Saved cart not found", 404);

    const mainCart = await Cart.findOne({
      where: { user_id: userId, type: "main" },
    });
    if (!mainCart) throw new CustomError("Main cart not found", 404);

    const savedCartItems = await CartItem.findAll({
      where: { cart_id: savedCartId },
    });

    if (!savedCartItems)
      throw new CustomError("Saved cart items not found", 404);
    if (savedCartItems.length === 0) {
      res.status(200).json({ message: "Saved cart is empty" });
    } else {
      // await CartItem.create({
      //   cart_id: mainCart.id,
      //   product_id: savedCartItems[0].product_id,
      //   quantity: savedCartItems[0].quantity,
      // });
      // res.status(200).json({ message: "Saved cart copied to main cart" });
    }
  } catch (error) {
    console.log("Error in copySavedCartToMain", error);
    next(error);
  }
};
