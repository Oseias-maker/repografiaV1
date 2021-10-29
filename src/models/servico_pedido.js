const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('servico_pedido', {
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pedido',
        key: 'id_pedido'
      }
    },
    servicoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'servico',
        key: 'id_servico'
      }
    }
  }, {
    sequelize,
    tableName: 'servico_pedido',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pedidoId" },
          { name: "servicoId" },
        ]
      },
      {
        name: "servico_pedido_servicoId_pedidoId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pedidoId" },
          { name: "servicoId" },
        ]
      },
      {
        name: "servicoId",
        using: "BTREE",
        fields: [
          { name: "servicoId" },
        ]
      },
    ]
  });
};
