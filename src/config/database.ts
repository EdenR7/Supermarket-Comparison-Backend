import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import dbConfig from "../../sequelize/config/config-for-ts";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export default sequelize;
