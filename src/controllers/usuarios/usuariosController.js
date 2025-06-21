const { usuarios } = require("../../models");
const { Op } = require("sequelize");

// Criar novo usuário
exports.criar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, email e senha são obrigatórios.",
      });
    }

    const usuarioExistente = await usuarios.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email já cadastrado.",
      });
    } // Cria o usuário passando a senha para o modelo
    const novoUsuario = await usuarios.create({
      nome,
      email,
      senha: senha, // O modelo tratará isso internamente
      tipo: tipo || "motorista",
    });

    const respostaUsuario = novoUsuario.toJSON();
    delete respostaUsuario.senha_hash;

    res.status(201).json({
      sucesso: true,
      mensagem: "Usuário criado com sucesso.",
      usuario: respostaUsuario,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Listar todos os usuários
exports.listar = async (req, res) => {
  try {
    const lista = await usuarios.findAll({
      attributes: { exclude: ["senha_hash"] },
    });
    res.json({ sucesso: true, usuarios: lista });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Buscar usuário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const usuario = await usuarios.findByPk(req.params.id, {
      attributes: { exclude: ["senha_hash"] },
    });
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado.",
      });
    }
    res.json({ sucesso: true, usuario });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar usuário.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const { nome, email, tipo, senha } = req.body;
    const usuario = await usuarios.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado.",
      });
    }
    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (tipo) usuario.tipo = tipo;
    // Passa a senha para o modelo
    if (senha) usuario.senha = senha; // O modelo tratará isso internamente

    usuario.atualizado_em = new Date();
    await usuario.save();

    const { senha_hash, ...usuarioSemSenha } = usuario.toJSON();

    res.json({
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso.",
      usuario: usuarioSemSenha,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar usuário.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Excluir (desativar) usuário
exports.excluir = async (req, res) => {
  try {
    const usuario = await usuarios.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado.",
      });
    }

    usuario.ativo = false;
    usuario.atualizado_em = new Date();
    await usuario.save();

    res.json({
      sucesso: true,
      mensagem: "Usuário desativado com sucesso.",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao desativar usuário.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};
