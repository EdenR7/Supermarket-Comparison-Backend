import { Router } from "express";
import {
  createCartWithProducts,
  createEmptyCart,
  getCartById,
  getUserCarts,
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

export default router;
