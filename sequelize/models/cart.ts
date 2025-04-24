import { Model, DataTypes, Transaction } from "sequelize";
import { CartAttributes, CartCreationAttributes } from "src/types/cart.types";
import sequelize from "../../src/config/database";
import { CustomError } from "../../src/utils/errors/CustomError";
import User from "./user";
import CartItem from "./cartItem";
import Product from "./product";

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

  public static async createEmptyCart(
    title: string,
    user_id: number,
    transaction?: Transaction
  ): Promise<CartAttributes> {
    try {
      const cart = await Cart.create(
        {
          title,
          user_id: user_id,
        },
        { transaction }
      );
      return cart;
    } catch (error) {
      throw new CustomError("Failed to create cart", 500);
    }
  }

  public static async getFullyCartDetails(cart_id: number) {
    try {
      const cart = await Cart.findByPk(cart_id, {
        include: [
          { model: CartItem, include: [{ model: Product }] },
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
        ],
      });
      const adjustedCart = {
        id : cart?.id
      }
      return cart;
    } catch (error) {
      throw new CustomError("Failed to get cart details", 500);
    }
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
