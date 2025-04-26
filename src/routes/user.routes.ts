import { Router } from "express";
import { getUsers, countUsers } from "../controllers/users.controller";

const userRouter: Router = Router();

userRouter.get("/", getUsers);

userRouter.get("/count", countUsers);

export default userRouter;
