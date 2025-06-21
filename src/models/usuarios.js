// Modelo de usuário utilizando Sequelize para ORM e bcryptjs para hash de senha
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

// Definição do modelo usuarios
const usuarios = sequelize.define(
  "usuarios", // nome do modelo padronizado
  {
    // Chave primária auto-incrementada
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // Campo virtual para senha (não persistido no banco)
    senha: {
      type: DataTypes.VIRTUAL,
      set(value) {
        // Quando a senha é definida, armazenamos no campo senha_hash
        this.setDataValue("senha_hash", value);
      },
    },
    // Nome do usuário
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // E-mail do usuário (único e validado)
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Hash da senha do usuário
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Tipo de usuário (admin ou usuario)
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "motorista",
      validate: {
        isIn: [["admin", "gestor", "motorista"]],
      },
    },
    // Indica se o usuário está ativo
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Data de criação do usuário
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Data da última atualização
    atualizado_em: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Data do último login
    ultimo_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios", // Nome da tabela no banco de dados
    timestamps: false, // Não utiliza os campos automáticos createdAt/updatedAt
    underscored: true, // Usa snake_case nos campos
    hooks: {
      // Antes de criar, gera o hash da senha
      beforeCreate: async (usuario) => {
        if (usuario.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
      // Antes de atualizar, gera novo hash se a senha foi alterada
      beforeUpdate: async (usuario) => {
        if (usuario.changed("senha_hash")) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
        }
      },
    },
  }
);

// Método de instância para verificar se a senha informada confere com o hash
usuarios.prototype.verificarSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senha_hash);
};

// Exporta o modelo usuarios
module.exports = usuarios;
