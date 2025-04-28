import dotenv from "dotenv";
dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port?: number;
  dialect: "postgres" | "mysql" | "sqlite" | "mariadb" | "mssql";
  logging?: boolean;
  use_env_variable?: string;
}

interface Config {
  [key: string]: DbConfig;
}

const dbConfig: Config = {
  development: {
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: "postgres",
  },
};


export default dbConfig;
