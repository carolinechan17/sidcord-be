'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orders.hasMany(models.carts, {
        foreignKey: {
          name: 'orderId',
        },
        as: 'carts',
      });
    }
  }
  orders.init(
    {
      customerUID: DataTypes.STRING,
      namaPenerima: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      alamat: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
      totalQuantity: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'orders',
    }
  );
  return orders;
};
