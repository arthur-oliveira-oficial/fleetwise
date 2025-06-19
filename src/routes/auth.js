const express = require("express");
const {
  register,
  login,
  getMe,
} = require("../controllers/auth/authController");
const { protect } = require("../middlewares/auth/authMiddleware");

const router = express.Router();

// Rotas públicas
router.post("/cadastro", register); // Novo nome para /register
router.post("/login", login); // Mantido

// Rotas protegidas
router.get("/perfil", protect, getMe); // Novo nome para /me

module.exports = router;
