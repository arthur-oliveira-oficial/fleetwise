// Importa o pacote swagger-jsdoc para gerar a especificação Swagger/OpenAPI
const swaggerJSDoc = require("swagger-jsdoc");

// Configurações para a documentação Swagger
const options = {
  definition: {
    openapi: "3.0.0", // Versão do OpenAPI
    info: {
      title: "FleetWise API", // Título da documentação
      version: "1.0.0", // Versão da API
      description: "Documentação da API FleetWise", // Descrição da API
    },
    servers: [
      {
        url: "http://localhost:3000/api", // URL base do servidor da API
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Caminho para os arquivos de rotas que terão comentários Swagger
};

// Gera a especificação Swagger com base nas opções acima
const swaggerSpec = swaggerJSDoc(options);

// Exporta a especificação para ser utilizada na aplicação
module.exports = swaggerSpec;
