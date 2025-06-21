// Arquivo principal da aplicação
// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa o framework Express
const express = require("express");
// Importa o Helmet para segurança HTTP
const helmet = require("helmet");
// Importa o express-rate-limit para limitação de requisições
const rateLimit = require("express-rate-limit");

// Importa o Sequelize e função para sincronizar modelos
const { sequelize, syncModels } = require("./src/models");

// Importa o Swagger UI e a especificação Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

// Inicializa a aplicação Express
const app = express();
// Aplica o Helmet como um dos primeiros middlewares
app.use(helmet());
// Define a porta do servidor (padrão 3000 se não houver variável de ambiente)
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limiter geral para todas as rotas /api (100 requisições por 15 minutos por IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições
  message: {
    sucesso: false,
    mensagem: "Muitas requisições deste IP, tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter específico para login (5 requisições por 10 minutos por IP)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // Limite de 5 tentativas
  message: {
    sucesso: false,
    mensagem:
      "Muitas tentativas de login deste IP. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

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

// Aplica o limiter geral para todas as rotas que começam com /api
app.use("/api", apiLimiter);

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
