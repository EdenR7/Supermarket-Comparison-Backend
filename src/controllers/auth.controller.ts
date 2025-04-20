import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { buildAuthResponse, generateToken } from "../utils/authFunctions";
import db from "../../sequelize/models";
const { User } = db;
import { CustomError } from "../utils/errors/CustomError";
// async function changePwd(req, res, next) {
//   const { email, newPassword } = req.body;
//   try {
//     if (!email || !newPassword) {
//       // throw new CustomError("Email and password are required", 404);
//     }
//     const user = await User.findOne({ where: { email } });
//     console.log(user);
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     const u = await User.update(
//       { password: hashedPassword },
//       {
//         where: { id: user.id },
//         returning: true,
//       }
//     );
//     console.log(u);
//     return res.status(200);
//   } catch (error) {
//     console.error("Error in changePwd controller:", error);
//     next(error);
//   }
// }

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomError("Username and password are required", 401);
    }
    const user = await User.findOne({
      where: { username },
    });
    if (!user) throw new CustomError("User not found", 404);

    const userData = user.dataValues;
    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) throw new CustomError("Authentication failed", 401);

    const token = generateToken(userData.id);
    const response = buildAuthResponse(userData, token);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error in login controller:", error);
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      throw new CustomError("Email, username, and password are required", 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = generateToken(user.id);
    const response = buildAuthResponse(user.dataValues, token);

    res.status(201).json(response);
  } catch (error) {
    console.log("Error in register controller:", error);
    next(error);
  }
}
