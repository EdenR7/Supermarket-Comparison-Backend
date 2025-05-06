import { Model, DataTypes, Transaction } from "sequelize";
import sequelize from "../../config/database";
import {
  CartItemAttributes,
  CartItemCreationAttributes,
  CreateCartItemProductsI,
} from "src/types/cartItem.types";
import { CustomError } from "../../utils/errors/CustomError";

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
    CartItem.belongsTo(models.Cart, { foreignKey: "cart_id", as: "cart" });
    CartItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  }

  public static async createCartItem(
    cart_id: number,
    product_id: number,
    quantity: number
  ) {
    try {
      const cartItem = await CartItem.create({ cart_id, product_id, quantity });
      return cartItem;
    } catch (error) {
      throw new CustomError("Failed to create cart item", 500);
    }
  }

  public static async generateCartItemsFromProducts(
    cart_id: number,
    products: CreateCartItemProductsI[],
    transaction?: Transaction
  ) {
    try {
      const cartItems = await Promise.all(
        products.map((product) => {
          const { product_id, quantity } = product;
          if (!product_id || !quantity || quantity <= 0) {
            return Promise.reject(
              new CustomError("Invalid product or quantity", 400)
            );
          }

          return CartItem.create(
            { cart_id, product_id, quantity },
            { transaction }
          );
        })
      );

      return cartItems;
    } catch (error) {
      console.log("error in generateCartItemsFromProducts", error);
      throw new CustomError("Failed to generate cart items", 500);
    }
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
