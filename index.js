// Arquivo principal da aplicação
// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa o framework Express
const express = require("express");

// Importa o Sequelize e função para sincronizar modelos
const { sequelize, syncModels } = require("./src/models");

// Importa o Swagger UI e a especificação Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

// Inicializa a aplicação Express
const app = express();
// Define a porta do servidor (padrão 3000 se não houver variável de ambiente)
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON e dados de formulários
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

// Rota principal para teste rápido da API
app.get("/", (req, res) => {
  res.send("FleetWise API está funcionando!");
});

// Importa e usa as rotas da aplicação (pasta src/routes)
const routes = require("./src/routes");
app.use("/api", routes);

// Rota para documentação Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para tratar erros 404 (endpoint não encontrado)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint não encontrado",
  });
});

// Middleware para tratar erros gerais da aplicação
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// Inicialização do servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
