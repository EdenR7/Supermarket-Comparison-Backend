import { Model, DataTypes } from "sequelize";
import sequelize from "../../src/config/database";
import {
  CartMemberAttributes,
  CartMemberCreationAttributes,
} from "src/types/cartMember.types";

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
    // This is a join table, associations are defined in User and Cart models
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
