// Script para criar usuário administrador
// Importa o modelo Usuario
const Usuario = require("../src/models/Usuario");
// Importa a configuração do banco de dados (sequelize)
const sequelize = require("../src/config/database");

// Função assíncrona para criar o usuário admin
async function criarAdmin() {
  try {
    // Autentica a conexão com o banco de dados
    await sequelize.authenticate();
    // Sincroniza os modelos com o banco de dados
    await sequelize.sync();
    // Cria o usuário administrador com os dados definidos
    const usuario = await Usuario.create({
      nome: "administrador",
      email: "administrador@teste.com",
      senha_hash: "senha12345", // Em produção, utilize hash seguro
      tipo: "admin",
      ativo: true,
      criado_em: new Date(),
      atualizado_em: new Date(),
    });
    // Exibe mensagem de sucesso com os dados do usuário criado
    console.log("Usuário administrador criado com sucesso:", usuario.toJSON());
  } catch (error) {
    // Exibe mensagem de erro caso ocorra alguma falha
    console.error("Erro ao criar usuário administrador:", error.message);
  } finally {
    // Fecha a conexão com o banco de dados
    await sequelize.close();
  }
}

// Executa a função para criar o admin
criarAdmin();
