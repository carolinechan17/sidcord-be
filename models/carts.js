'use strict';
const { Model, DATE } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      carts.hasMany(models.cartItems, {
        foreignKey: {
          name: 'cartId',
        },
        as: 'cartItems',
      });
    }
  }
  carts.init(
    {
      orderId: DataTypes.INTEGER,
      ongkir: DataTypes.INTEGER,
      kurirId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'carts',
    }
  );
  return carts;
};
