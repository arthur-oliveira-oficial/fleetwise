const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "usuario",
      validate: {
        isIn: [["admin", "usuario"]],
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    atualizado_em: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ultimo_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    underscored: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("senha_hash")) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
    },
  }
);

// Método para verificar senha
Usuario.prototype.verificarSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senha_hash);
};

module.exports = Usuario;
