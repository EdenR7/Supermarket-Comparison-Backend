import express from "express";

import dotenv from "dotenv";
import { app, main } from "./app";
import sequelize from "./config/database";

const PORT = process.env.PORT || 3000;

app.use(express.json());

main();

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected  ✅");
    dotenv.config();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
