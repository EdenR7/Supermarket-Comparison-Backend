import { Model, DataTypes } from "sequelize";
import sequelize from "../../src/config/database";
import {
  CartItemAttributes,
  CartItemCreationAttributes,
} from "src/types/cartItem.types";

class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: number;
  public cart_id!: number;
  public product_id!: number;
  public quantity!: number;

  // Associations
  public static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: "cart_id" });
    CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
  }
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "carts",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: false,
  }
);

export default CartItem;
