const { motoristas } = require("../../models");
const { Op } = require("sequelize");

// Criar novo motorista
exports.criar = async (req, res) => {
  try {
    const {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      cnh_numero,
      cnh_categoria,
      cnh_data_vencimento,
      telefone_principal,
      email,
      telefone_emergencia,
      endereco_completo,
      status,
    } = req.body;

    // Validação de campos obrigatórios
    if (!nome_completo || !cpf || !cnh_numero || !cnh_data_vencimento) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "Os campos nome_completo, cpf, cnh_numero e cnh_data_vencimento são obrigatórios.",
      });
    }

    // Verifica se já existe motorista com o mesmo CPF
    const motoristaCpf = await motoristas.findOne({ where: { cpf } });
    if (motoristaCpf) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "CPF já cadastrado.",
      });
    }

    // Verifica se já existe motorista com o mesmo CNH
    const motoristaCnh = await motoristas.findOne({ where: { cnh_numero } });
    if (motoristaCnh) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "CNH já cadastrada.",
      });
    }

    // Cria o novo motorista
    const novoMotorista = await motoristas.create({
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      cnh_numero,
      cnh_categoria,
      cnh_data_vencimento,
      telefone_principal,
      email,
      telefone_emergencia,
      endereco_completo,
      status: status || "Ativo",
      data_cadastro: new Date(),
      data_atualizacao: new Date(),
    });

    res.status(201).json({
      sucesso: true,
      mensagem: "Motorista cadastrado com sucesso.",
      dados: novoMotorista,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar motorista.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Listar todos os motoristas
exports.listar = async (req, res) => {
  try {
    const lista = await motoristas.findAll();
    res.status(200).json({
      sucesso: true,
      mensagem: "Lista de motoristas retornada com sucesso.",
      dados: lista,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar motoristas.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Buscar motorista por ID
exports.buscarPorId = async (req, res) => {
  try {
    const motorista = await motoristas.findByPk(req.params.id);
    if (!motorista) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Motorista não encontrado.",
      });
    }
    res.status(200).json({
      sucesso: true,
      mensagem: "Motorista encontrado.",
      dados: motorista,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar motorista.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Atualizar motorista
exports.atualizar = async (req, res) => {
  try {
    const motorista = await motoristas.findByPk(req.params.id);
    if (!motorista) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Motorista não encontrado.",
      });
    }

    const {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      cnh_numero,
      cnh_categoria,
      cnh_data_vencimento,
      telefone_principal,
      email,
      telefone_emergencia,
      endereco_completo,
      status,
    } = req.body;

    // Se for alterar CPF, verifica se já existe em outro motorista
    if (cpf && cpf !== motorista.cpf) {
      const existeCpf = await motoristas.findOne({
        where: {
          cpf,
          id: { [Op.ne]: motorista.id },
        },
      });
      if (existeCpf) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "CPF já cadastrado para outro motorista.",
        });
      }
      motorista.cpf = cpf;
    }

    // Se for alterar CNH, verifica se já existe em outro motorista
    if (cnh_numero && cnh_numero !== motorista.cnh_numero) {
      const existeCnh = await motoristas.findOne({
        where: {
          cnh_numero,
          id: { [Op.ne]: motorista.id },
        },
      });
      if (existeCnh) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "CNH já cadastrada para outro motorista.",
        });
      }
      motorista.cnh_numero = cnh_numero;
    }

    if (nome_completo) motorista.nome_completo = nome_completo;
    if (rg) motorista.rg = rg;
    if (data_nascimento) motorista.data_nascimento = data_nascimento;
    if (cnh_categoria) motorista.cnh_categoria = cnh_categoria;
    if (cnh_data_vencimento)
      motorista.cnh_data_vencimento = cnh_data_vencimento;
    if (telefone_principal) motorista.telefone_principal = telefone_principal;
    if (email) motorista.email = email;
    if (telefone_emergencia)
      motorista.telefone_emergencia = telefone_emergencia;
    if (endereco_completo) motorista.endereco_completo = endereco_completo;
    if (status) motorista.status = status;

    motorista.data_atualizacao = new Date();

    await motorista.save();

    res.status(200).json({
      sucesso: true,
      mensagem: "Motorista atualizado com sucesso.",
      dados: motorista,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar motorista.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Excluir (desativar) motorista
exports.excluir = async (req, res) => {
  try {
    const motorista = await motoristas.findByPk(req.params.id);
    if (!motorista) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Motorista não encontrado.",
      });
    }

    motorista.status = "Inativo";
    motorista.data_atualizacao = new Date();
    await motorista.save();

    res.status(200).json({
      sucesso: true,
      mensagem: "Motorista desativado com sucesso.",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao desativar motorista.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};
