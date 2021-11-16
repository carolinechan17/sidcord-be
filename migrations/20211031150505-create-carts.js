"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("carts", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: "orders",
          key: "id",
        },
      },
      ongkir: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      kurirId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sellerUID: {
        type: Sequelize.STRING,
        references: {
          model: "sellers",
          key: "uid",
        },
      },
      status: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("carts");
  },
};
