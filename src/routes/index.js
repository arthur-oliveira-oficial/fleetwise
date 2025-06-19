// Arquivo principal para gerenciamento de rotas
const express = require("express");
const router = express.Router();

// Importação das rotas
const authRoutes = require("./auth");

// Definição das rotas
router.use("/auth", authRoutes);

// Rota de status da API
router.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
