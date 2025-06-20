const { usuarios } = require("../../models");
const { Op } = require("sequelize");

// Registrar um novo usuário
exports.registrar = async (req, res) => {
  try {
    const { nomeUsuario, email, senha, nomeCompleto, funcao } = req.body;
    const usuarioExistente = await usuarios.findOne({
      where: {
        [Op.or]: [{ nome: nomeUsuario }, { email }],
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Usuário ou email já cadastrado",
      });
    }
    const novoUsuario = await usuarios.create({
      nome: nomeUsuario,
      email,
      senha_hash: senha,
      nomeCompleto,
      funcao: funcao || "usuario",
    });

    const respostaUsuario = novoUsuario.toJSON();
    delete respostaUsuario.senha_hash;

    res.status(201).json({
      sucesso: true,
      mensagem: "Usuário registrado com sucesso",
      usuario: respostaUsuario,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar usuário",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Obter informações do usuário atual
exports.obterUsuarioAtual = async (req, res) => {
  try {
    const usuario = await usuarios.findByPk(req.user.id, {
      attributes: { exclude: ["senha_hash"] },
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
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Atualizar informações do usuário autenticado
exports.atualizarCadastro = async (req, res) => {
  try {
    const { nome, email, funcao, senhaAtual, novaSenha } = req.body;
    const usuario = await usuarios.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (funcao) usuario.funcao = funcao;

    if (senhaAtual || novaSenha) {
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Para alterar a senha, envie senhaAtual e novaSenha.",
        });
      }
      if (!(await usuario.verificarSenha(senhaAtual))) {
        return res
          .status(400)
          .json({ sucesso: false, mensagem: "Senha atual incorreta" });
      }
      usuario.senha_hash = novaSenha;
    }

    usuario.atualizado_em = new Date();
    await usuario.save();

    const { senha_hash, ...usuarioSemSenha } = usuario.toJSON();

    res.json({
      sucesso: true,
      mensagem: "Cadastro atualizado com sucesso",
      usuario: usuarioSemSenha,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar cadastro",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Excluir (desativar) o usuário autenticado
exports.excluirUsuario = async (req, res) => {
  try {
    const usuario = await usuarios.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    usuario.ativo = false;
    usuario.atualizado_em = new Date();
    await usuario.save();

    res.json({
      sucesso: true,
      mensagem: "Usuário excluído com sucesso",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao excluir usuário",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};
