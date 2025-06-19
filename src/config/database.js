require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "nome_do_banco",
  process.env.DB_USER || "usuario",
  process.env.DB_PASSWORD || "senha",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? true : false,
  }
);

module.exports = sequelize;
