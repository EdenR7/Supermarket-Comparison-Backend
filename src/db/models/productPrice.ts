import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";
import {
  ProductPriceAttributes,
  ProductPriceCreationAttributes,
} from "src/types/productPrice.types";

class ProductPrice
  extends Model<ProductPriceAttributes, ProductPriceCreationAttributes>
  implements ProductPriceAttributes
{
  public id!: number;
  public product_id!: number;
  public supermarket_id!: number;
  public price!: number;
  public last_updated!: Date;

  // Associations
  public static associate(models: any) {
    ProductPrice.belongsTo(models.Product, { foreignKey: "product_id" });
    ProductPrice.belongsTo(models.Supermarket, {
      foreignKey: "supermarket_id",
    });
  }
}

ProductPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    supermarket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "supermarkets",
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ProductPrice",
    tableName: "product_prices",
    timestamps: false,
  }
);

export default ProductPrice;
