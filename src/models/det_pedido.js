const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('det_pedido', {
    id_det_pedido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedido',
        key: 'id_pedido'
      }
    },
    id_tipos_copia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_copia',
        key: 'id_tipos_copia'
      }
    },
    id_acabamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acabamento',
        key: 'id_acabamento'
      }
    },
    id_tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tamanho_pagina',
        key: 'id_tamanho'
      }
    },
    id_tipos_capa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_capa',
        key: 'id_tipos_capa'
      }
    },
    observacoes: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    num_copias: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    num_paginas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sub_total_copias: {
      type: DataTypes.DECIMAL(10, 5),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'det_pedido',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_det_pedido" },
        ]
      },
      {
        name: "id_pedido",
        using: "BTREE",
        fields: [
          { name: "id_pedido" },
        ]
      },
      {
        name: "id_tipos_copia",
        using: "BTREE",
        fields: [
          { name: "id_tipos_copia" },
        ]
      },
      {
        name: "id_acabamento",
        using: "BTREE",
        fields: [
          { name: "id_acabamento" },
        ]
      },
      {
        name: "id_tamanho",
        using: "BTREE",
        fields: [
          { name: "id_tamanho" },
        ]
      },
      {
        name: "id_tipos_capa",
        using: "BTREE",
        fields: [
          { name: "id_tipos_capa" },
        ]
      },
    ]
  });
};
