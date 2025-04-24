import { Optional } from "sequelize";

export interface CartItemAttributes {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

export interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

export interface CreateCartItemProductsI {
  product_id: number;
  quantity: number;
}
