const sequelize = require("../config/database");

// Importação de modelos
const Usuario = require("./Usuario");

// Definir relações entre modelos
// Adicione novas relações conforme necessário

// Sincronizar modelos com o banco de dados
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Models synchronized with database");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
};

// Módulo de inicialização dos modelos
module.exports = {
  sequelize,
  Usuario,
  syncModels,
};
