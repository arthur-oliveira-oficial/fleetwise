const sequelize = require("../config/database");

// Importação de modelos
// Por exemplo:
// const User = require('./User');
// const Vehicle = require('./Vehicle');

// Definir relações entre modelos
// Por exemplo:
// User.hasMany(Vehicle);
// Vehicle.belongsTo(User);

// Módulo de inicialização dos modelos
module.exports = {
  sequelize,
  // Exportar modelos
  // User,
  // Vehicle,
};
