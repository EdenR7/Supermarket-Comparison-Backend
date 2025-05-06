import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { UserAttributes, UserCreationAttributes } from "src/types/user.types";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public username!: string;
  public password!: string;
  public isAppAdmin!: boolean;
  public mainCartId!: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public static associate(models: any) {
    User.hasMany(models.Cart, { foreignKey: "user_id" });
    User.belongsToMany(models.Cart, {
      through: models.CartMember,
      foreignKey: "user_id",
    });
    User.belongsTo(models.Cart, { foreignKey: "mainCartId", as: "mainCart" });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAppAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mainCartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "carts",
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
