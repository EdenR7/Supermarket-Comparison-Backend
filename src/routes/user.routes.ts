import { Router } from "express";
import { createUser, getUsers } from "../controllers/users.controller";

const userRouter: Router = Router();

userRouter.get("/", async (req, res) => {
  await getUsers(req, res);
});

userRouter.post("/", async (req, res) => {
  await createUser(req, res);
});

export default userRouter;
