import { Router } from "express";
import {
  createCartWithProducts,
  createEmptyCart,
  getCartById,
  getUserSavedCarts,
  deleteCart,
  addCartMember,
  removeCartMember,
  countUserCarts,
  copySavedCartToMain,
  addCartItem,
  getUserMainCart,
  deleteCartItem,
  updateCartItemQuantity,
  clearCart,
  mergeCartToMain,
} from "../controllers/cart.controller";

const router = Router();

// Get all carts for the authenticated user
router.get("/saved", getUserSavedCarts);

// Get the count of carts for the authenticated user
router.get("/count", countUserCarts);

// Get the main cart for the authenticated user
router.get("/user-main", getUserMainCart);

// Get a cart by ID
router.get("/:id", getCartById);

// Create an empty cart
router.post("/", createEmptyCart);

// Create a cart with products
router.post("/with-products", createCartWithProducts);

// Add a product to a cart
router.post("/cart-items/:id", addCartItem);

// Add a member to a cart
router.post("/cart-members/:id", addCartMember);

// Get the main cart for the authenticated user
router.put("/merge-to-main", mergeCartToMain);

// Copy a saved cart content to the main cart
router.put("/copy-to-main/:savedCartId", copySavedCartToMain);

// Update the quantity of a cart item
router.patch("/cart-items/qty/:cartItemId", updateCartItemQuantity);

// Remove a member from a cart
router.delete("/cart-members/:id", removeCartMember);

// Clear a cart
router.delete("/cart-items/clear/:id", clearCart);

// Delete a cart item
router.delete("/cart-items/:id", deleteCartItem);

// Delete a cart
router.delete("/:id", deleteCart);

export default router;
