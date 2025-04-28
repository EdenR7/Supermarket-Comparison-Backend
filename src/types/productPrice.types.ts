import { Optional } from "sequelize";
import { SupermarketAttributes } from "./supermarket.types";

export interface ProductPriceAttributes {
  id: number;
  product_id: number;
  supermarket_id: number;
  price: number;
  last_updated: Date;
}

export interface ProductPriceCreationAttributes
  extends Optional<ProductPriceAttributes, "id"> {}

export interface ProductPriceI {
  id: number;
  price: number;
  last_updated: Date;
  supermarket: string;
}
