"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerUID: {
        type: Sequelize.STRING,
        references: {
          model: "customers",
          key: "uid",
        },
      },
      alamatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalQuantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("orders");
  },
};
