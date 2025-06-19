const express = require("express");
const {
  registrar,
  login,
  obterUsuarioAtual,
} = require("../controllers/auth/authController");
const { proteger } = require("../middlewares/auth/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
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
 */

// Rotas públicas
router.post("/cadastro", registrar); // Novo nome para /register
router.post("/login", login); // Mantido

// Rotas protegidas
router.get("/perfil", proteger, obterUsuarioAtual); // Novo nome para /me

module.exports = router;
