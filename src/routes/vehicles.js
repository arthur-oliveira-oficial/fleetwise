// Rotas para gerenciamento de veículos
const express = require("express");
const router = express.Router();

// Controladores seriam importados aqui
// const vehicleController = require('../controllers/vehicleController');

// Listar todos os veículos
router.get("/", (req, res) => {
  // Implementação temporária
  res.json({ message: "Listar todos os veículos" });
  // Quando o controlador estiver implementado:
  // vehicleController.getAllVehicles(req, res);
});

// Obter detalhes de um veículo específico
router.get("/:id", (req, res) => {
  res.json({ message: `Detalhes do veículo ${req.params.id}` });
});

// Cadastrar novo veículo
router.post("/", (req, res) => {
  res.json({
    message: "Veículo cadastrado com sucesso",
    data: req.body,
  });
});

// Atualizar veículo existente
router.put("/:id", (req, res) => {
  res.json({
    message: `Veículo ${req.params.id} atualizado com sucesso`,
    data: req.body,
  });
});

// Remover veículo
router.delete("/:id", (req, res) => {
  res.json({ message: `Veículo ${req.params.id} removido com sucesso` });
});

module.exports = router;
