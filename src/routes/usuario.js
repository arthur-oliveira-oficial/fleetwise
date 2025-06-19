const express = require("express");
const {
  registrar,
  obterUsuarioAtual,
  atualizarSenha,
} = require("../controllers/auth/authController");
const { proteger } = require("../middlewares/auth/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /usuario/cadastro:
 *   post:
 *     summary: Realiza o cadastro de um novo usuário
 *     tags: [Usuário]
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
router.post("/cadastro", registrar);

/**
 * @swagger
 * /usuario/perfil:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.get("/perfil", proteger, obterUsuarioAtual);

/**
 * @swagger
 * /usuario/atualizar-senha:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado
 *     tags: [Usuário]
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
