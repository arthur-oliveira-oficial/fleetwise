// Arquivo principal para gerenciamento de rotas
const express = require("express");
const router = express.Router();

// Importação das rotas
const authRoutes = require("./auth");
const usuarioRoutes = require("./usuarios"); // Alterado para './usuarios'
const veiculosRoutes = require("./veiculos"); // Adiciona as rotas de veículos

// Definição das rotas
router.use("/", authRoutes); // Alterado de "/auth" para "/" para que o login fique em /login
router.use("/usuarios", usuarioRoutes); // Alterado para '/usuarios'
router.use("/veiculos", veiculosRoutes); // Adiciona a rota de veículos

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Verifica o status da API
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: Retorna o status online, timestamp e ambiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: online
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-06-19T12:34:56.789Z'
 *                 environment:
 *                   type: string
 *                   example: development
 */
// Rota de status da API
router.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
