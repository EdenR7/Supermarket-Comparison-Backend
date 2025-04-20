import { Model, DataTypes } from "sequelize";
import { CartAttributes, CartCreationAttributes } from "src/types/cart.types";
import sequelize from "../../src/config/database";

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public title!: string;
  public user_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public static associate(models: any) {
    Cart.belongsTo(models.User, { foreignKey: "user_id" });
    Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
    Cart.belongsToMany(models.User, {
      through: models.CartMember,
      foreignKey: "cart_id",
    });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    timestamps: true,
  }
);

export default Cart;
