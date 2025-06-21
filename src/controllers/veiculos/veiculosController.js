const { veiculos } = require("../../models");

// Criar novo veículo
exports.criar = async (req, res) => {
  try {
    const { placa, chassi, marca, modelo, ano, cor, tipo, status } = req.body;

    // Verifica se já existe veículo com a mesma placa ou chassi
    const veiculoExistente = await veiculos.findOne({
      where: { placa },
    });
    if (veiculoExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Já existe um veículo cadastrado com esta placa.",
      });
    }

    const veiculoExistenteChassi = await veiculos.findOne({
      where: { chassi },
    });
    if (veiculoExistenteChassi) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Já existe um veículo cadastrado com este chassi.",
      });
    }

    const novoVeiculo = await veiculos.create({
      placa,
      chassi,
      marca,
      modelo,
      ano,
      cor,
      tipo,
      status: status || "ativo",
      criado_em: new Date(),
      atualizado_em: new Date(),
    });

    res.status(201).json({
      sucesso: true,
      mensagem: "Veículo cadastrado com sucesso.",
      veiculo: novoVeiculo,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar veículo.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Listar todos os veículos
exports.listar = async (req, res) => {
  try {
    const lista = await veiculos.findAll();
    res.json({ sucesso: true, veiculos: lista });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar veículos.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Buscar veículo por ID
exports.buscarPorId = async (req, res) => {
  try {
    const veiculo = await veiculos.findByPk(req.params.id);
    if (!veiculo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Veículo não encontrado.",
      });
    }
    res.json({ sucesso: true, veiculo });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar veículo.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Atualizar veículo
exports.atualizar = async (req, res) => {
  try {
    const { placa, chassi, marca, modelo, ano, cor, tipo, status } = req.body;
    const veiculo = await veiculos.findByPk(req.params.id);

    if (!veiculo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Veículo não encontrado.",
      });
    }

    if (placa) veiculo.placa = placa;
    if (chassi) veiculo.chassi = chassi;
    if (marca) veiculo.marca = marca;
    if (modelo) veiculo.modelo = modelo;
    if (ano) veiculo.ano = ano;
    if (cor) veiculo.cor = cor;
    if (tipo) veiculo.tipo = tipo;
    if (status) veiculo.status = status;

    veiculo.atualizado_em = new Date();
    await veiculo.save();

    res.json({
      sucesso: true,
      mensagem: "Veículo atualizado com sucesso.",
      veiculo,
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar veículo.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};

// Excluir (desativar) veículo
exports.excluir = async (req, res) => {
  try {
    const veiculo = await veiculos.findByPk(req.params.id);

    if (!veiculo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Veículo não encontrado.",
      });
    }

    veiculo.status = "inativo";
    veiculo.atualizado_em = new Date();
    await veiculo.save();

    res.json({
      sucesso: true,
      mensagem: "Veículo desativado com sucesso.",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao desativar veículo.",
      erro: process.env.NODE_ENV === "development" ? erro.message : undefined,
    });
  }
};
