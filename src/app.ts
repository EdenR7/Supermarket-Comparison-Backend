import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
// import session from "express-session";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errors.middleware";
import productsRoutes from "./routes/products.routes";
import cartRoutes from "./routes/cart.routes";
import { verifyToken } from "./middlewares/auth.middleware";

export const app = express();

export function main() {
  app.use(express.json());
  app.use(cors());
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Todos API");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRoutes);
  app.use("/api/users", verifyToken, userRouter);
  app.use("/api/carts", verifyToken, cartRoutes);

  app.use(errorHandler);
}
