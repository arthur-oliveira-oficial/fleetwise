// Middleware de autenticação e autorização para rotas protegidas usando JWT
// Importa o pacote jsonwebtoken para manipulação de tokens JWT
const jwt = require("jsonwebtoken");
// Importa o model de Usuário
const { usuarios } = require("../../models"); // Corrigido para novo nome e caminho

// Variável de ambiente para o segredo do JWT ou um valor padrão
const SEGREDO_JWT = process.env.JWT_SECRET;
// Verificar se a chave secreta está definida
if (!SEGREDO_JWT) {
  // Exibe um aviso caso a chave não esteja definida
  console.error(
    "AVISO: SEGREDO_JWT não definido no arquivo .env - use um valor seguro para ambientes de produção!"
  );
}

/**
 * Middleware para proteger rotas que requerem autenticação
 * Verifica se o token JWT está presente e válido, e se o usuário está ativo
 */
exports.proteger = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está presente no cabeçalho Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extrai o token do cabeçalho
      token = req.headers.authorization.split(" ")[1];
    }

    // Verificar se o token existe
    if (!token) {
      // Retorna erro caso não haja token
      return res.status(401).json({
        sucesso: false,
        mensagem: "Acesso não autorizado. Faça login para continuar.",
      });
    }

    try {
      // Verificar o token
      const decodificado = jwt.verify(token, SEGREDO_JWT);
      // Buscar usuário pelo novo model e campo correto
      const usuarioAtual = await usuarios.findByPk(decodificado.id);

      if (!usuarioAtual) {
        // Retorna erro caso o usuário não exista mais
        return res.status(401).json({
          sucesso: false,
          mensagem: "O usuário associado a este token não existe mais.",
        });
      }
      // Verificar se o usuário está ativo
      if (!usuarioAtual.ativo) {
        // Retorna erro caso o usuário esteja desativado
        return res.status(401).json({
          sucesso: false,
          mensagem:
            "Esta conta foi desativada. Entre em contato com o administrador.",
        });
      }

      // Adicionar os dados decodificados do token à requisição
      req.user = decodificado;
      next(); // Continua para o próximo middleware ou rota
    } catch (erro) {
      // Token inválido ou expirado
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token inválido ou expirado. Faça login novamente.",
        erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
      });
    }
  } catch (erro) {
    // Erro inesperado no middleware
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
 * Recebe uma lista de funções permitidas e verifica se o usuário tem permissão
 */
exports.autorizar = (...funcoes) => {
  return (req, res, next) => {
    // Verifica se a função do usuário está entre as permitidas
    if (!funcoes.includes(req.user.funcao)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Você não tem permissão para acessar este recurso",
      });
    }
    next(); // Continua para o próximo middleware ou rota
  };
};
