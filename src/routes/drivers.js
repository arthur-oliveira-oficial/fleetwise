// Rotas para gerenciamento de motoristas
const express = require("express");
const router = express.Router();

// Controladores seriam importados aqui
// const driverController = require('../controllers/driverController');

// Listar todos os motoristas
router.get("/", (req, res) => {
  // Implementação temporária
  res.json({ message: "Listar todos os motoristas" });
  // Quando o controlador estiver implementado:
  // driverController.getAllDrivers(req, res);
});

// Obter detalhes de um motorista específico
router.get("/:id", (req, res) => {
  res.json({ message: `Detalhes do motorista ${req.params.id}` });
});

// Cadastrar novo motorista
router.post("/", (req, res) => {
  res.json({
    message: "Motorista cadastrado com sucesso",
    data: req.body,
  });
});

// Atualizar motorista existente
router.put("/:id", (req, res) => {
  res.json({
    message: `Motorista ${req.params.id} atualizado com sucesso`,
    data: req.body,
  });
});

// Remover motorista
router.delete("/:id", (req, res) => {
  res.json({ message: `Motorista ${req.params.id} removido com sucesso` });
});

// Obter histórico de veículos dirigidos por um motorista
router.get("/:id/vehicles", (req, res) => {
  res.json({ message: `Histórico de veículos do motorista ${req.params.id}` });
});

module.exports = router;
