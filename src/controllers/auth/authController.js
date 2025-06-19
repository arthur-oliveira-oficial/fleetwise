const jwt = require("jsonwebtoken");
const { Usuario, sequelize } = require("../../models");

// Variável de ambiente para o segredo do JWT ou um valor padrão
const JWT_SECRET = process.env.JWT_SECRET;
// Verificar se a chave secreta está definida
if (!JWT_SECRET) {
  console.error(
    "AVISO: JWT_SECRET não definido no arquivo .env - use um valor seguro para ambientes de produção!"
  );
}
// Tempo de expiração do token (padrão: 24 horas)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Registrar um novo usuário
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body; // Verificar se o usuário ou email já existem
    const existingUser = await Usuario.findOne({
      where: {
        [sequelize.Op.or]: [{ nome: username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Usuário ou email já cadastrado",
      });
    } // Criar novo usuário
    const newUser = await Usuario.create({
      nome: username,
      email,
      senha_hash: password, // Será criptografado pelo hook beforeCreate
      nomeCompleto: fullName,
      funcao: role || "usuario",
    });

    // Remover a senha do objeto de resposta
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      user: userResponse,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao registrar usuário",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Login de usuário (refatorado para novo model)
 */
exports.login = async (req, res) => {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const Usuario = require("../../models/Usuario");

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Email e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ where: { email, ativo: true } });

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
    } // Atualiza o campo ultimo_login
    usuario.ultimo_login = new Date();
    await usuario.save();

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove o campo senha_hash do retorno
    const { senha_hash, ...usuarioSemSenha } = usuario.toJSON();

    return res.json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};

/**
 * Obter informações do usuário atual
 */
exports.getMe = async (req, res) => {
  try {
    // req.user é definido pelo middleware de autenticação
    const user = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ["senha"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro no servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
