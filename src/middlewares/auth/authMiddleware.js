const jwt = require("jsonwebtoken");
const { Usuario } = require("../../models");

// Variável de ambiente para o segredo do JWT ou um valor padrão
const JWT_SECRET = process.env.JWT_SECRET;
// Verificar se a chave secreta está definida
if (!JWT_SECRET) {
  console.error(
    "AVISO: JWT_SECRET não definido no arquivo .env - use um valor seguro para ambientes de produção!"
  );
}

/**
 * Middleware para proteger rotas que requerem autenticação
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está presente no cabeçalho Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acesso não autorizado. Faça login para continuar.",
      });
    }

    try {
      // Verificar o token
      const decoded = jwt.verify(token, JWT_SECRET); // Verificar se o usuário ainda existe
      const currentUser = await Usuario.findByPk(decoded.id);

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "O usuário associado a este token não existe mais.",
        });
      } // Verificar se o usuário está ativo
      if (!currentUser.estaAtivo) {
        return res.status(401).json({
          success: false,
          message:
            "Esta conta foi desativada. Entre em contato com o administrador.",
        });
      }

      // Adicionar o usuário à requisição para uso em controladores posteriores
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token inválido ou expirado. Faça login novamente.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    res.status(500).json({
      success: false,
      message: "Erro no servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Middleware para restringir acesso com base nas funções do usuário
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para acessar este recurso",
      });
    }
    next();
  };
};
