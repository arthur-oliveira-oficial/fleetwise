const express = require("express");
const { body } = require("express-validator");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} = require("../controllers/veiculos/veiculosController");
const { proteger } = require("../middlewares/auth/authMiddleware");
const { validarErros } = require("../middlewares/validationMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Veículos
 *     description: Gerenciamento de veículos da frota
 */

/**
 * @swagger
 * /veiculos:
 *   post:
 *     summary: Cadastra um novo veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placa
 *               - chassi
 *               - marca
 *               - modelo
 *               - ano
 *               - cor
 *               - tipo
 *             properties:
 *               placa:
 *                 type: string
 *               chassi:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               ano:
 *                 type: integer
 *               cor:
 *                 type: string
 *               tipo:
 *                 type: string
 *               status:
 *                 type: string
 *                 description: Status do veículo (ativo/inativo)
 *     responses:
 *       201:
 *         description: Veículo cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
 *       400:
 *         description: Dados inválidos ou veículo já existe
 */
router.post("/", proteger, validarVeiculoCriacao, criar);

/**
 * @swagger
 * /veiculos:
 *   get:
 *     summary: Lista todos os veículos
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veículos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 veiculos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Veiculo'
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.get("/", proteger, listar);

/**
 * @swagger
 * /veiculos/{id}:
 *   get:
 *     summary: Busca um veículo pelo ID
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do veículo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
 *       404:
 *         description: Veículo não encontrado
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.get("/:id", proteger, buscarPorId);

/**
 * @swagger
 * /veiculos/{id}:
 *   put:
 *     summary: Atualiza os dados de um veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do veículo
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *               chassi:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               ano:
 *                 type: integer
 *               cor:
 *                 type: string
 *               tipo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Veículo não encontrado
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.put("/:id", proteger, atualizar);

/**
 * @swagger
 * /veiculos/{id}:
 *   delete:
 *     summary: Desativa um veículo (exclusão lógica)
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do veículo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Veículo desativado com sucesso
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
 *         description: Veículo não encontrado
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.delete("/:id", proteger, excluir);

/**
 * @swagger
 * components:
 *   schemas:
 *     Veiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         placa:
 *           type: string
 *         chassi:
 *           type: string
 *         marca:
 *           type: string
 *         modelo:
 *           type: string
 *         ano:
 *           type: integer
 *         cor:
 *           type: string
 *         tipo:
 *           type: string
 *         status:
 *           type: string
 *         criado_em:
 *           type: string
 *           format: date-time
 *         atualizado_em:
 *           type: string
 *           format: date-time
 */

module.exports = router;

/**
 * Middleware de validação para criação de veículo
 */
const validarVeiculoCriacao = [
  body("placa")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("A placa é obrigatória."),
  body("chassi")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("O chassi é obrigatório."),
  body("marca")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("A marca é obrigatória."),
  body("modelo")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("O modelo é obrigatório."),
  body("ano").isInt().withMessage("O ano deve ser um número inteiro."),
  body("cor").trim().escape().notEmpty().withMessage("A cor é obrigatória."),
  body("tipo").trim().escape().notEmpty().withMessage("O tipo é obrigatório."),
  validarErros,
];
