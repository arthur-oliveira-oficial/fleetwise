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
        [sequelize.Op.or]: [{ nomeUsuario: username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Usuário ou email já cadastrado",
      });
    } // Criar novo usuário
    const newUser = await Usuario.create({
      nomeUsuario: username,
      email,
      senha: password, // Será criptografado pelo hook beforeCreate
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
 * Login de usuário
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // Verificar se o usuário existe
    const user = await Usuario.findOne({
      where: { nomeUsuario: username },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    } // Verificar se o usuário está ativo
    if (!user.estaAtivo) {
      return res.status(401).json({
        success: false,
        message: "Conta desativada. Entre em contato com o administrador.",
      });
    } // Verificar a senha
    const isPasswordValid = await user.verificarSenha(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    } // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.nomeUsuario,
        role: user.funcao,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        username: user.nomeUsuario,
        email: user.email,
        fullName: user.nomeCompleto,
        role: user.funcao,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({
      success: false,
      message: "Erro no servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
