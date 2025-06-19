// Arquivo principal da aplicação
require("dotenv").config();
const express = require("express");
// Importa o Sequelize e os modelos da nova estrutura
const { sequelize, syncModels } = require("./src/models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste de conexão com o banco de dados e sincronização de modelos
sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    // Sincronizar modelos com o banco de dados
    await syncModels();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

// Rotas da aplicação
app.get("/", (req, res) => {
  res.send("FleetWise API está funcionando!");
});

// Importar e usar as rotas da aplicação
const routes = require("./src/routes");
app.use("/api", routes);

// Middleware para tratar erros 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint não encontrado",
  });
});

// Middleware para tratar erros gerais
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
