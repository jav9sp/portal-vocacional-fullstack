import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    models: [__dirname + "/../models/**/*.ts"],
    dialect: "mysql",
  }
);

export default db;
