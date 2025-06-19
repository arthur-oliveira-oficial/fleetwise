// Controlador de autenticação: lida com registro, login e obtenção de informações do usuário
const jwt = require("jsonwebtoken");
const { Usuario } = require("../../models");
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
 * Registrar um novo usuário
 * Recebe os dados do usuário, verifica se já existe e cria um novo registro.
 * Remove a senha do objeto de resposta por segurança.
 */
exports.registrar = async (req, res) => {
  try {
    const { nomeUsuario, email, senha, nomeCompleto, funcao } = req.body; // Verificar se o usuário ou email já existem
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ nome: nomeUsuario }, { email }],
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Usuário ou email já cadastrado",
      });
    } // Criar novo usuário
    const novoUsuario = await Usuario.create({
      nome: nomeUsuario,
      email,
      senha_hash: senha, // Será criptografado pelo hook beforeCreate
      nomeCompleto,
      funcao: funcao || "usuario",
    });

    // Remover a senha do objeto de resposta
    const respostaUsuario = novoUsuario.toJSON();
    delete respostaUsuario.senha;

    res.status(201).json({
      sucesso: true,
      mensagem: "Usuário registrado com sucesso",
      usuario: respostaUsuario,
    });
  } catch (erro) {
    console.error("Erro ao registrar usuário:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar usuário",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

/**
 * Login de usuário
 * Verifica email e senha, gera token JWT e retorna dados do usuário (sem senha).
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

    // Busca usuário ativo pelo email
    const usuario = await Usuario.findOne({ where: { email, ativo: true } });

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

/**
 * Obter informações do usuário atual
 * Busca o usuário autenticado pelo ID (definido no middleware) e retorna seus dados (sem senha).
 */
exports.obterUsuarioAtual = async (req, res) => {
  try {
    // req.user é definido pelo middleware de autenticação
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      sucesso: true,
      usuario,
    });
  } catch (erro) {
    console.error("Erro ao obter informações do usuário:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};
