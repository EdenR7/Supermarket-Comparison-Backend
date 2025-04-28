import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";
import {
  CategoryAttributes,
  CategoryCreationAttributes,
} from "src/types/category.types";

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;

  // Associations
  public static associate(models: any) {
    Category.hasMany(models.Product, { foreignKey: "category_id" });
  }
}

Category.init(
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
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

export default Category;
