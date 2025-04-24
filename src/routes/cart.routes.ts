import { Router } from "express";
import {
  createCartWithProducts,
  createEmptyCart,
  getCartById,
  getUserCarts,
  deleteCart,
  addCartMember
} from "../controllers/cart.controller";

const router = Router();

// Get all carts for the authenticated user
router.get("/", getUserCarts);

// Get a cart by ID
router.get("/:id", getCartById);

// Create an empty cart
router.post("/", createEmptyCart);

// Create a cart with products
router.post("/with-products", createCartWithProducts);

// Add a product to a cart
router.post("/cart-members/:id", addCartMember);

// Delete a cart
router.delete("/:id", deleteCart);


export default router;
