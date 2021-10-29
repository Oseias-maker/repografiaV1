const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pedido', {
    id_pedido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'nif'
      }
    },
    titulo_pedido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_centro_custos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'centro_custos',
        key: 'id_centro_custos'
      }
    },
    id_modo_envio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'modo_envio',
        key: 'id_modo_envio'
      }
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'curso',
        key: 'id_curso'
      }
    },
    id_avaliacao_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'avaliacao_pedido',
        key: 'id_avaliacao_pedido'
      }
    },
    avaliacao_obs: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    custo_total: {
      type: DataTypes.DECIMAL(10, 5),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pedido',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pedido" },
        ]
      },
      {
        name: "nif",
        using: "BTREE",
        fields: [
          { name: "nif" },
        ]
      },
      {
        name: "id_modo_envio",
        using: "BTREE",
        fields: [
          { name: "id_modo_envio" },
        ]
      },
      {
        name: "id_curso",
        using: "BTREE",
        fields: [
          { name: "id_curso" },
        ]
      },
      {
        name: "id_avaliacao_pedido",
        using: "BTREE",
        fields: [
          { name: "id_avaliacao_pedido" },
        ]
      },
      {
        name: "pedido_ibfk_3",
        using: "BTREE",
        fields: [
          { name: "id_centro_custos" },
        ]
      },
    ]
  });
};
