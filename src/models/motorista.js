const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Motorista = sequelize.define(
  "motoristas",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome_completo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    rg: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cnh_numero: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    cnh_categoria: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    cnh_data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    telefone_principal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    telefone_emergencia: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    endereco_completo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Ativo",
    },
    data_cadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "motoristas",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Motorista;
