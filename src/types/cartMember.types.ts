import { Optional } from "sequelize";

export interface CartMemberAttributes {
  id: number;
  cart_id: number;
  user_id: number;
  is_admin: boolean;
}

export interface CartMemberCreationAttributes
  extends Optional<CartMemberAttributes, "id"> {}
