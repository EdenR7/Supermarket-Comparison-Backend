import { Request, Response } from "express";
import { Op } from "sequelize";
import db from "../../sequelize/models";
import { UserAttributes, UserWithoutPasswordI } from "src/types/user.types";
const { User } = db;

export async function createUser(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({
      email,
      username,
      password, // Note: In a real app, you should hash this password
    });

    const userResponse: UserWithoutPasswordI = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users: UserWithoutPasswordI[] = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
