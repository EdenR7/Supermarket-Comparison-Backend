import { Optional } from "sequelize";

export interface CartAttributes {
  id: number;
  title?: string;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
  type: CartType;
}

export type CartType = "saved" | "main" | "active";

export interface CartCreationAttributes
  extends Optional<CartAttributes, "id" | "createdAt" | "updatedAt"> {}
