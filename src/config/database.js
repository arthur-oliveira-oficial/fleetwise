// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();
// Importa o construtor Sequelize
const { Sequelize } = require("sequelize");

// Cria uma instância do Sequelize usando variáveis de ambiente ou valores padrão
const sequelize = new Sequelize(
  process.env.DB_NAME || "nome_do_banco", // Nome do banco de dados
  process.env.DB_USER || "usuario", // Usuário do banco de dados
  process.env.DB_PASSWORD || "senha", // Senha do banco de dados
  {
    host: process.env.DB_HOST || "localhost", // Host do banco de dados
    dialect: process.env.DB_DIALECT || "mysql", // Dialeto do banco (ex: mysql, postgres)
    logging: process.env.DB_LOGGING === "true" ? true : false, // Ativa/desativa logs SQL
  }
);

// Exporta a instância do Sequelize para ser usada em outros arquivos
module.exports = sequelize;
