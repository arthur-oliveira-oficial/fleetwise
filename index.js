// Arquivo principal da aplicação
const express = require("express");
// Importa o Sequelize e os modelos da nova estrutura
const { sequelize } = require("./src/models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste de conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

// Rotas da aplicação
app.get("/", (req, res) => {
  res.send("FleetWise API está funcionando!");
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
