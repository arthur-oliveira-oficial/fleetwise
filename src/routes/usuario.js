const express = require("express");
const {
  registrar,
  obterUsuarioAtual,
  atualizarCadastro, // Mantido apenas este para unificar a atualização
  excluirUsuario, // Adicionado para exclusão
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
 * /usuario/atualizar:
 *   put:
 *     summary: Atualiza informações do usuário autenticado (nome, email, tipo e/ou senha)
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
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 description: "Tipo do usuário (ex: 'admin', 'usuario')"
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual do usuário (obrigatória para alteração de senha)
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha desejada
 *     responses:
 *       200:
 *         description: Cadastro atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou senha atual incorreta
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/atualizar", proteger, atualizarCadastro);

/**
 * @swagger
 * /usuario/excluir:
 *   delete:
 *     summary: Exclui (desativa) o usuário autenticado
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/excluir", proteger, excluirUsuario);

module.exports = router;
