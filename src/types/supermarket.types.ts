import { Optional } from "sequelize";

export interface SupermarketAttributes {
  id: number;
  name: string;
  brand_img: string;
}

export interface SupermarketCreationAttributes
  extends Optional<SupermarketAttributes, "id"> {}
