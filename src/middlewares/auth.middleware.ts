import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { AuthRequest } from "src/types/auth.types";
import User from "sequelize/models/user";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    console.log(`auth.middleware: no token provided`);
    return res.status(401).json("Access denied");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(
      "auth.middleware, verifyToken. Error while verifying token",
      errorName,
      errorMessage
    );
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function verifyAppAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req as AuthRequest;
  const user = await User.findByPk(userId);
  if (user?.isAppAdmin) {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
}
