import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserAttributes, UserWithoutPasswordI } from "src/types/user.types";

dotenv.config();

const { JWT_SECRET } = process.env;

function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: "5d",
  });
}

function validateToken(token: string) {
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, JWT_SECRET!);
}

function buildAuthResponse(
  user: UserAttributes,
  token: string
): UserWithoutPasswordI & { token: string } {
  const { password, ...rest } = user;
  return { ...rest, token };
}

export { generateToken, validateToken, buildAuthResponse };
