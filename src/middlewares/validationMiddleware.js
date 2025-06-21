const { validationResult } = require("express-validator");

const validarErros = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro de validação.",
      erros: erros.array(),
    });
  }
  next();
};

module.exports = { validarErros };
