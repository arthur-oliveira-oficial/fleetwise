// Script para testar a conexão com o banco de dados
require("dotenv").config();
const sequelize = require("../src/config/database");

async function testDatabaseConnection() {
  console.log("Testando conexão com o banco de dados...");
  console.log("Configurações:");
  console.log(`- Host: ${process.env.DB_HOST || "localhost"}`);
  console.log(`- Banco de Dados: ${process.env.DB_NAME || "nome_do_banco"}`);
  console.log(`- Usuário: ${process.env.DB_USER || "usuario"}`);
  console.log(`- Dialeto: ${process.env.DB_DIALECT || "mysql"}`);

  try {
    // Tenta autenticar a conexão
    await sequelize.authenticate();
    console.log("✅ Conexão estabelecida com sucesso!");

    // Verifica se o banco de dados está respondendo com uma consulta simples
    const [results] = await sequelize.query("SELECT 1+1 AS resultado");
    console.log(
      "✅ Consulta de teste executada com sucesso: ",
      results[0].resultado
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Não foi possível conectar ao banco de dados:",
      error.message
    );
    console.error("Detalhes do erro:", error);
    return false;
  } finally {
    // Fecha a conexão ao finalizar
    await sequelize.close();
    console.log("Conexão fechada.");
  }
}

// Executa o teste imediatamente se o script for executado diretamente
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      console.log(
        "\nResultado final:",
        success ? "Conexão OK" : "Falha na conexão"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Erro inesperado:", error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };
