import { Model, DataTypes, Transaction } from "sequelize";
import sequelize from "../../src/config/database";
import {
  CartMemberAttributes,
  CartMemberCreationAttributes,
} from "../../src/types/cartMember.types";

class CartMember
  extends Model<CartMemberAttributes, CartMemberCreationAttributes>
  implements CartMemberAttributes
{
  public id!: number;
  public cart_id!: number;
  public user_id!: number;
  public is_admin!: boolean;

  // Associations
  public static associate(models: any) {
    CartMember.belongsTo(models.User, { foreignKey: "user_id" });
    CartMember.belongsTo(models.Cart, { foreignKey: "cart_id" });
  }
  public static async addMemberToCart(
    cart_id: number,
    user_id: number,
    is_admin?: boolean,
    transaction?: Transaction
  ) {
    const cartMember = await CartMember.create(
      {
        cart_id,
        user_id,
        is_admin: is_admin || false,
      },
      { transaction }
    );
    return cartMember;
  }
}

CartMember.init(
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "CartMember",
    tableName: "cart_members",
    timestamps: false,
  }
);

export default CartMember;
