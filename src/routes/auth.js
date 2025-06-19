const express = require("express");
const {
  register,
  login,
  getMe,
} = require("../../controllers/auth/authController");
const { protect } = require("../../middlewares/auth/authMiddleware");

const router = express.Router();

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rotas protegidas
router.get("/me", protect, getMe);

module.exports = router;
