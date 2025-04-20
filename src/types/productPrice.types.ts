import { Optional } from "sequelize";

export interface ProductPriceAttributes {
  id: number;
  product_id: number;
  supermarket_id: number;
  price: number;
  last_updated: Date;
}

export interface ProductPriceCreationAttributes
  extends Optional<ProductPriceAttributes, "id"> {}
