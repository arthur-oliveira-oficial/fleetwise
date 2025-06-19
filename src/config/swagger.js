const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FleetWise API",
      version: "1.0.0",
      description: "Documentação da API FleetWise",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
