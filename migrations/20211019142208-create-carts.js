'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      customerUID: {
        type: Sequelize.STRING,
        unique: true,
        references: {
          model: 'customers',
          key: 'uid',
        },
      },
      namaPenerima: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      noTelp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      alamat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      namaKurir: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('carts');
  },
};
