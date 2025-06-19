const jwt = require("jsonwebtoken");
const Usuario = require("../../models/Usuario"); // Corrigido para manter padrão

// Variável de ambiente para o segredo do JWT ou um valor padrão
const SEGREDO_JWT = process.env.JWT_SECRET;
// Verificar se a chave secreta está definida
if (!SEGREDO_JWT) {
  console.error(
    "AVISO: SEGREDO_JWT não definido no arquivo .env - use um valor seguro para ambientes de produção!"
  );
}

/**
 * Middleware para proteger rotas que requerem autenticação
 */
exports.proteger = async (req, res, next) => {
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
        sucesso: false,
        mensagem: "Acesso não autorizado. Faça login para continuar.",
      });
    }

    try {
      // Verificar o token
      const decodificado = jwt.verify(token, SEGREDO_JWT);
      // Buscar usuário pelo novo model e campo correto
      const usuarioAtual = await Usuario.findByPk(decodificado.id);

      if (!usuarioAtual) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "O usuário associado a este token não existe mais.",
        });
      }
      // Verificar se o usuário está ativo
      if (!usuarioAtual.ativo) {
        return res.status(401).json({
          sucesso: false,
          mensagem:
            "Esta conta foi desativada. Entre em contato com o administrador.",
        });
      }

      // Adicionar os dados decodificados do token à requisição
      req.user = decodificado;
      next();
    } catch (erro) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token inválido ou expirado. Faça login novamente.",
        erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
      });
    }
  } catch (erro) {
    console.error("Erro no middleware de autenticação:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

/**
 * Middleware para restringir acesso com base nas funções do usuário
 */
exports.autorizar = (...funcoes) => {
  return (req, res, next) => {
    if (!funcoes.includes(req.user.funcao)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Você não tem permissão para acessar este recurso",
      });
    }
    next();
  };
};
