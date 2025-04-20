import { Optional } from "sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}
