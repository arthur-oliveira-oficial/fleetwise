const express = require("express");
const { proteger } = require("../middlewares/auth/authMiddleware");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} = require("../controllers/motorista/motoristaController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Motoristas
 *     description: Gerenciamento de motoristas
 *
 * components:
 *   schemas:
 *     Motorista:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome_completo:
 *           type: string
 *         cpf:
 *           type: string
 *         rg:
 *           type: string
 *           nullable: true
 *         data_nascimento:
 *           type: string
 *           format: date
 *           nullable: true
 *         cnh_numero:
 *           type: string
 *         cnh_categoria:
 *           type: string
 *           nullable: true
 *         cnh_data_vencimento:
 *           type: string
 *           format: date
 *         telefone_principal:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         telefone_emergencia:
 *           type: string
 *           nullable: true
 *         endereco_completo:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *         data_cadastro:
 *           type: string
 *           format: date-time
 *         data_atualizacao:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /motoristas:
 *   post:
 *     summary: Cadastra um novo motorista
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_completo
 *               - cpf
 *               - cnh_numero
 *               - cnh_data_vencimento
 *             properties:
 *               nome_completo:
 *                 type: string
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               cnh_numero:
 *                 type: string
 *               cnh_categoria:
 *                 type: string
 *               cnh_data_vencimento:
 *                 type: string
 *                 format: date
 *               telefone_principal:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone_emergencia:
 *                 type: string
 *               endereco_completo:
 *                 type: string
 *               status:
 *                 type: string
 *                 description: Status do motorista (Ativo/Inativo)
 *     responses:
 *       201:
 *         description: Motorista cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   $ref: '#/components/schemas/Motorista'
 *       400:
 *         description: Dados inválidos ou motorista já existe
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os motoristas
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de motoristas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Motorista'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /motoristas/{id}:
 *   get:
 *     summary: Busca um motorista pelo ID
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do motorista
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Motorista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   $ref: '#/components/schemas/Motorista'
 *       404:
 *         description: Motorista não encontrado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza os dados de um motorista
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do motorista
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_completo:
 *                 type: string
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               cnh_numero:
 *                 type: string
 *               cnh_categoria:
 *                 type: string
 *               cnh_data_vencimento:
 *                 type: string
 *                 format: date
 *               telefone_principal:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone_emergencia:
 *                 type: string
 *               endereco_completo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Motorista atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   $ref: '#/components/schemas/Motorista'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Motorista não encontrado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Desativa um motorista (exclusão lógica)
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do motorista
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Motorista desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *       404:
 *         description: Motorista não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

// Rotas protegidas para gerenciamento de motoristas
router.post("/", proteger, criar);
router.get("/", proteger, listar);
router.get("/:id", proteger, buscarPorId);
router.put("/:id", proteger, atualizar);
router.delete("/:id", proteger, excluir);

module.exports = router;
