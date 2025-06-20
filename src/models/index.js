// Importa a instância do Sequelize configurada para o banco de dados
const sequelize = require("../config/database");

// Importação de modelos
const usuarios = require("./usuarios"); // Modelo de usuário do sistema

// Definir relações entre modelos
// Adicione novas relações conforme necessário

// Função para sincronizar os modelos com o banco de dados
const syncModels = async () => {
  try {
    // Sincroniza todos os modelos definidos com o banco de dados, aplicando alterações
    await sequelize.sync({ alter: true });
    console.log("Models synchronized with database");
  } catch (error) {
    // Exibe erro caso a sincronização falhe
    console.error("Error synchronizing models:", error);
  }
};

// Exporta os modelos e a função de sincronização para uso em outras partes da aplicação
module.exports = {
  sequelize,
  usuarios,
  syncModels,
};
