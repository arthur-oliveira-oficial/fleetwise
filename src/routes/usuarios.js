const express = require("express");
const { body } = require("express-validator");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} = require("../controllers/usuarios/usuariosController");
const { proteger, autorizar } = require("../middlewares/auth/authMiddleware");
const { validarErros } = require("../middlewares/validationMiddleware");

const router = express.Router();

/**
 * Middleware de validação para criação de usuário
 */
const validarUsuarioCriacao = [
  body("nome").trim().escape().notEmpty().withMessage("O nome é obrigatório."),
  body("email").normalizeEmail().isEmail().withMessage("Email inválido."),
  body("senha")
    .isLength({ min: 8 })
    .withMessage("A senha deve ter no mínimo 8 caracteres."),
  validarErros,
];

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Realiza o cadastro de um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [admin, gestor, motorista]
 *                 description: "Tipo do usuário (admin, gestor ou motorista)"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     ativo:
 *                       type: boolean
 *                     criado_em:
 *                       type: string
 *                       format: date-time
 *                     atualizado_em:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos ou usuário já existe
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       ativo:
 *                         type: boolean
 *                       criado_em:
 *                         type: string
 *                         format: date-time
 *                       atualizado_em:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna os dados de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser buscado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     ativo:
 *                       type: boolean
 *                     criado_em:
 *                       type: string
 *                       format: date-time
 *                     atualizado_em:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
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
 *                 enum: [admin, gestor, motorista]
 *                 description: "Tipo do usuário (admin, gestor ou motorista)"
 *               senha:
 *                 type: string
 *                 description: Nova senha (opcional)
 *     responses:
 *       200:
 *         description: Cadastro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     ativo:
 *                       type: boolean
 *                     criado_em:
 *                       type: string
 *                       format: date-time
 *                     atualizado_em:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui (desativa) um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.post("/", proteger, autorizar("admin"), validarUsuarioCriacao, criar);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       ativo:
 *                         type: boolean
 *                       criado_em:
 *                         type: string
 *                         format: date-time
 *                       atualizado_em:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.get("/", proteger, autorizar("admin"), listar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna os dados de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser buscado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     ativo:
 *                       type: boolean
 *                     criado_em:
 *                       type: string
 *                       format: date-time
 *                     atualizado_em:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", proteger, autorizar("admin"), buscarPorId);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
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
 *                 enum: [admin, gestor, motorista]
 *                 description: "Tipo do usuário (admin, gestor ou motorista)"
 *               senha:
 *                 type: string
 *                 description: Nova senha (opcional)
 *     responses:
 *       200:
 *         description: Cadastro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     ativo:
 *                       type: boolean
 *                     criado_em:
 *                       type: string
 *                       format: date-time
 *                     atualizado_em:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/:id", proteger, autorizar("admin"), atualizar);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui (desativa) um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *       401:
 *         description: Token de autenticação ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:id", proteger, autorizar("admin"), excluir);

module.exports = router;
