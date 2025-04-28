import { Router } from "express";
import {
  getUsers,
  countUsers,
  getLoggedInUser,
} from "../controllers/users.controller";

const userRouter: Router = Router();

userRouter.get("/all", getUsers);

userRouter.get("/me", getLoggedInUser);

userRouter.get("/count", countUsers);

export default userRouter;
