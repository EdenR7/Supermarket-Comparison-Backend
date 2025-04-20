import { Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPasswordI extends Omit<UserAttributes, "password"> {}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}
