import { Model, DataTypes } from "sequelize";
import {
  SupermarketAttributes,
  SupermarketCreationAttributes,
} from "../../src/types/supermarket.types";
import sequelize from "../../src/config/database";

class Supermarket
  extends Model<SupermarketAttributes, SupermarketCreationAttributes>
  implements SupermarketAttributes
{
  public id!: number;
  public name!: string;
  public brand_img!: string;

  // Associations
  public static associate(models: any) {
    Supermarket.hasMany(models.ProductPrice, { foreignKey: "supermarket_id" });
  }
}

Supermarket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Supermarket",
    tableName: "supermarkets",
    timestamps: false,
  }
);

export default Supermarket;
