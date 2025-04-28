import { NextFunction, Request, Response } from "express";
import db from "../db/models";
import { UserWithoutPasswordI } from "src/types/user.types";
import { buildUserQuery } from "../helpers/user.helpers";
import { AuthRequest } from "../types/auth.types";
import { CustomError } from "../utils/errors/CustomError";
const { User } = db;

export async function countUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { whereClause } = buildUserQuery(req.query);
    const count = await User.count({ where: whereClause });
    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting users:", error);
    next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit, offset, whereClause } = buildUserQuery(req.query);

    const users: UserWithoutPasswordI[] = await User.findAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
      where: whereClause,
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
}

export async function getLoggedInUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) throw new CustomError("User not found", 404);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    next(error);
  }
}
