import { Router } from "express";
import {
  countProducts,
  getAllProducts,
  getProductById,
} from "../controllers/products.controller";

const router = Router();

// GET all products
router.get("/", getAllProducts);

// GET the count of products
router.get("/count", countProducts);

// GET product by ID
router.get("/:id", getProductById);

export default router;
