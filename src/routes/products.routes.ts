import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/products.controller";

const router = Router();

// GET all products
router.get("/", getAllProducts);

// GET product by ID
router.get("/:id", getProductById);

export default router;
