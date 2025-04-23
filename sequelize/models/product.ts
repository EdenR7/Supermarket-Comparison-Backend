import { Model, DataTypes } from "sequelize";
import sequelize from "../../src/config/database";
import {
  ProductAttributes,
  ProductCreationAttributes,
} from "../../src/types/product.types";

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public img_url!: string;
  public category_id!: number;

  // Associations
  public static associate(models: any) {
    Product.belongsTo(models.Category, { foreignKey: "category_id" });
    Product.hasMany(models.ProductPrice, { foreignKey: "product_id" });
    Product.hasMany(models.CartItem, { foreignKey: "product_id" });
  }

  // Static methods for common queries
  
  

  // Get product by ID with details
  public static async findByPkWithDetails(id: number) {
    return this.findByPk(id, {
      include: [
        {
          model: sequelize.models.Category,
          attributes: ["id", "name"],
        },
        {
          model: sequelize.models.ProductPrice,
          include: [
            {
              model: sequelize.models.Supermarket,
              attributes: ["id", "name", "brand_img"],
            },
          ],
        },
      ],
    });
  }
}

Product.init(
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
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);

export default Product;
