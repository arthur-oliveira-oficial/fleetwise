// Script para criar usuário administrador automaticamente
const Usuario = require("../src/models/Usuario");
const sequelize = require("../src/config/database");

async function criarAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const usuario = await Usuario.create({
      nome: "administrador",
      email: "administrador@teste.com",
      senha_hash: "admin12345",
      tipo: "admin",
      ativo: true,
      criado_em: new Date(),
      atualizado_em: new Date(),
    });
    console.log("Usuário administrador criado com sucesso:", usuario.toJSON());
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error.message);
  } finally {
    await sequelize.close();
  }
}

criarAdmin();
