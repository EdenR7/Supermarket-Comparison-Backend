import { Model, DataTypes, Transaction } from "sequelize";
import {
  CartAttributes,
  CartCreationAttributes,
  CartType,
} from "src/types/cart.types";
import sequelize from "../../config/database";
import { CustomError } from "../../utils/errors/CustomError";
import User from "./user";
import CartItem from "./cartItem";
import Product from "./product";
import CartMember from "./cartMember";

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public title!: string;
  public user_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public type!: CartType;

  // Associations
  public static associate(models: any) {
    Cart.belongsTo(models.User, { foreignKey: "user_id", as: "creator" });
    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      as: "cartItems",
      onDelete: "CASCADE",
    });
    Cart.hasMany(models.CartMember, {
      foreignKey: "cart_id",
      as: "cartMembers",
      onDelete: "CASCADE",
    });
    Cart.belongsToMany(models.User, {
      through: models.CartMember,
      foreignKey: "cart_id",
      otherKey: "user_id",
      as: "members",
    });
  }

  public static async createEmptyCart(
    title: string,
    user_id: number,
    type: CartType,
    transaction?: Transaction
  ): Promise<CartAttributes> {
    try {
      if (type === "saved" && !title)
        throw new CustomError("Saved carts must have a title", 400);
      const cart = await Cart.create(
        {
          title,
          user_id,
          type,
        },
        { transaction }
      );
      return cart;
    } catch (error) {
      throw new CustomError("Failed to create cart", 500);
    }
  }

  public static async getMainCart(user_id: number) {
    try {
      const cart = await Cart.findOne({
        where: { user_id, type: "main" },
        attributes: ["id", "type"],
        include: [
          {
            model: CartItem,
            as: "cartItems",
            attributes: ["id", "quantity"],
            include: [{ model: Product, as: "product" }],
          },
        ],
      });
      if (!cart) throw new CustomError("Main cart not found", 404);
      return cart;
    } catch (error) {
      throw new CustomError("Failed to get main cart", 500);
    }
  }

  public static async getCartWithItems(cart_id: number) {
    try {
      const cart = await Cart.findByPk(cart_id, {
        attributes: ["id", "title", "type"],
        include: [
          {
            model: CartItem,
            as: "cartItems",
            attributes: ["id", "quantity"],
            include: [{ model: Product, as: "product" }],
          },
        ],
      });
      if (!cart) throw new CustomError("Cart not found", 404);
      return cart;
    } catch (error) {
      console.log("error in getCartWithItems", error);

      throw new CustomError("Failed to get cart with items", 500);
    }
  }

  public static async getFullyCartDetails(cart_id: number) {
    try {
      const cart = await Cart.findByPk(cart_id, {
        include: [
          { model: CartItem, include: [{ model: Product }] },
          {
            model: CartMember,
            include: [
              {
                model: User,
                attributes: ["id", "username", "email"],
              },
            ],
          },
        ],
      });
      if (!cart) throw new CustomError("Cart not found", 404);

      // const adjustedCart = {
      //   id: cart?.id,
      //   title: cart?.title,
      //   user_id: cart?.user_id,
      //   createdAt: cart?.createdAt,
      //   updatedAt: cart?.updatedAt,
      //   members: cart.CartMembers.map((member) => ({
      //     id: member.id,
      //     user_id: member.user_id,
      //     is_admin: member.is_admin,
      //   })),
      // };

      return cart;
    } catch (error) {
      throw new CustomError("Failed to get cart details", 500);
    }
  }

  public static async getUserSavedCarts(
    userId: number,
    limit?: number,
    offset?: number
  ) {
    try {
      const carts = await Cart.findAll({
        where: { user_id: userId, type: "saved" },
        include: [
          // First include to get all cart members
          {
            model: CartMember,
            include: [
              {
                model: User,
                attributes: ["id", "username", "email"],
              },
            ],
          },
          {
            model: CartMember,
            where: { user_id: userId },
            required: true, // Makes it an INNER JOIN
            attributes: [],
          },
        ],

        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
      return carts;
    } catch (error) {
      console.log("error in getUserCarts", error);
      throw error;
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
      allowNull: true,
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
    type: {
      type: DataTypes.ENUM("saved", "main", "active"),
      allowNull: false,
      defaultValue: "saved",
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
