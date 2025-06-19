// Arquivo principal para gerenciamento de rotas
const express = require("express");
const router = express.Router();

// Importação das rotas
const vehicleRoutes = require("./vehicles");
const driverRoutes = require("./drivers");
const maintenanceRoutes = require("./maintenance");

// Definição das rotas
router.use("/vehicles", vehicleRoutes);
router.use("/drivers", driverRoutes);
router.use("/maintenance", maintenanceRoutes);

// Rota de status da API
router.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
