// Rotas para gerenciamento de manutenções
const express = require("express");
const router = express.Router();

// Controladores seriam importados aqui
// const maintenanceController = require('../controllers/maintenanceController');

// Listar todas as manutenções
router.get("/", (req, res) => {
  // Implementação temporária
  res.json({ message: "Listar todas as manutenções" });
  // Quando o controlador estiver implementado:
  // maintenanceController.getAllMaintenances(req, res);
});

// Obter detalhes de uma manutenção específica
router.get("/:id", (req, res) => {
  res.json({ message: `Detalhes da manutenção ${req.params.id}` });
});

// Cadastrar nova manutenção
router.post("/", (req, res) => {
  res.json({
    message: "Manutenção cadastrada com sucesso",
    data: req.body,
  });
});

// Atualizar registro de manutenção
router.put("/:id", (req, res) => {
  res.json({
    message: `Manutenção ${req.params.id} atualizada com sucesso`,
    data: req.body,
  });
});

// Remover registro de manutenção
router.delete("/:id", (req, res) => {
  res.json({ message: `Manutenção ${req.params.id} removida com sucesso` });
});

// Listar manutenções de um veículo específico
router.get("/vehicle/:vehicleId", (req, res) => {
  res.json({ message: `Manutenções do veículo ${req.params.vehicleId}` });
});

// Registrar conclusão de manutenção
router.patch("/:id/complete", (req, res) => {
  res.json({ message: `Manutenção ${req.params.id} marcada como concluída` });
});

module.exports = router;
