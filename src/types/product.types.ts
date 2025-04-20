import { Optional } from "sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  img_url: string;
  category_id: number;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}
