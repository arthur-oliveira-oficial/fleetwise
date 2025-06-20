// Controlador de autenticação: lida com registro, login e obtenção de informações do usuário
const jwt = require("jsonwebtoken");
const { usuarios } = require("../../models");
const { Op } = require("sequelize");

// Variável de ambiente para o segredo do JWT ou um valor padrão
const SEGREDO_JWT = process.env.JWT_SECRET;
// Verificar se a chave secreta está definida
if (!SEGREDO_JWT) {
  console.error(
    "AVISO: SEGREDO_JWT não definido no arquivo .env - use um valor seguro para ambientes de produção!"
  );
}
// Tempo de expiração do token (padrão: 24 horas)
const JWT_TEMPO_EXPIRACAO = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Login de usuário
 * Verifica email e senha, gera token JWT e retorna dados do usuário (sem senha).
 */
exports.login = async (req, res) => {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const usuarios = require("../../models/usuarios");

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Email e senha são obrigatórios." });
    }

    // Busca usuário ativo pelo email
    const usuario = await usuarios.findOne({ where: { email, ativo: true } });

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
    }

    // Compara senha informada com hash armazenado
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
    } // Atualiza o campo ultimo_login
    usuario.ultimo_login = new Date();
    await usuario.save();

    // Monta payload do token
    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    // Gera token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove o campo senha_hash do retorno
    const { senha_hash, ...usuarioSemSenha } = usuario.toJSON();

    return res.json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};
