const express = require("express");
const {
  registrar,
  login,
  obterUsuarioAtual,
} = require("../controllers/auth/authController");
const { proteger } = require("../middlewares/auth/authMiddleware");

const router = express.Router();

// Rotas públicas
router.post("/cadastro", registrar); // Novo nome para /register
router.post("/login", login); // Mantido

// Rotas protegidas
router.get("/perfil", proteger, obterUsuarioAtual); // Novo nome para /me

module.exports = router;
