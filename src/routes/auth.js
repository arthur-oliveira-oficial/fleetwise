const express = require("express");
const {
  registrar,
  login,
  obterUsuarioAtual,
  atualizarSenha,
} = require("../controllers/auth/authController");
const { proteger } = require("../middlewares/auth/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /auth/cadastro:
 *   post:
 *     summary: Realiza o cadastro de um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 description: "Tipo do usuário (ex: 'admin', 'usuario')"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já existe
 */

// Rotas públicas
router.post("/cadastro", registrar); // Novo nome para /register

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
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login); // Mantido

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */

// Rotas protegidas
router.get("/perfil", proteger, obterUsuarioAtual); // Novo nome para /me

/**
 * @swagger
 * /auth/atualizar-senha:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual do usuário
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha desejada
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Senha atual incorreta ou dados inválidos
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/atualizar-senha", proteger, atualizarSenha);

module.exports = router;
