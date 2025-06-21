const express = require("express");
const rateLimit = require("express-rate-limit"); // Importa o rateLimit
const { login } = require("../controllers/auth/authController");

const router = express.Router();

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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", loginLimiter, login);

module.exports = router;
