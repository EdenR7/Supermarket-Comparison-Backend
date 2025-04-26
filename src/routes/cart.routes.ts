import { Router } from "express";
import {
  createCartWithProducts,
  createEmptyCart,
  getCartById,
  getUserCarts,
  deleteCart,
  addCartMember,
  removeCartMember,
  countUserCarts,
} from "../controllers/cart.controller";

const router = Router();

// Get all carts for the authenticated user
router.get("/", getUserCarts);

// Get the count of carts for the authenticated user
router.get("/count", countUserCarts);

// Get a cart by ID
router.get("/:id", getCartById);

// Create an empty cart
router.post("/", createEmptyCart);

// Create a cart with products
router.post("/with-products", createCartWithProducts);

// Add a product to a cart
router.post("/cart-members/:id", addCartMember);

// Remove a member from a cart
router.delete("/cart-members/:id", removeCartMember);

// Delete a cart
router.delete("/:id", deleteCart);

export default router;
