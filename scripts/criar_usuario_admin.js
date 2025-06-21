// Script para criar usuário administrador
// Importa o modelo usuarios
const usuarios = require("../src/models/usuarios");
// Importa a configuração do banco de dados (sequelize)
const sequelize = require("../src/config/database");
require("dotenv").config(); // Carrega variáveis de ambiente

// Verifica se a variável de ambiente da senha está definida
const senhaAdmin = process.env.ADMIN_PASSWORD;
if (!senhaAdmin) {
  console.error(
    "Erro: A variável de ambiente ADMIN_PASSWORD não está definida. Defina-a antes de executar este script."
  );
  process.exit(1);
}

// Função assíncrona para criar o usuário admin
async function criarAdmin() {
  try {
    // Autentica a conexão com o banco de dados
    await sequelize.authenticate();
    // Sincroniza os modelos com o banco de dados
    await sequelize.sync();
    // Cria o usuário administrador com os dados definidos
    const usuario = await usuarios.create({
      nome: "administrador",
      email: "administrador@teste.com",
      senha: senhaAdmin, // Passa a senha para o modelo, que fará o hash
      tipo: "admin",
      ativo: true,
      criado_em: new Date(),
      atualizado_em: new Date(),
    });
    // Exibe mensagem de sucesso sem mostrar a senha
    const { senha_hash, ...usuarioSemSenha } = usuario.toJSON();
    console.log("Usuário administrador criado com sucesso:", usuarioSemSenha);
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
