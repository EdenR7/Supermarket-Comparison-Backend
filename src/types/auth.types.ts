import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export interface UserJwtPaylod extends JwtPayload {
  _id: string;
}
