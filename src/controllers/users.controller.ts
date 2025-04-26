import { NextFunction, Request, Response } from "express";
import db from "../../sequelize/models";
import { UserWithoutPasswordI } from "src/types/user.types";
import { buildUserQuery } from "../helpers/user.helpers";
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
