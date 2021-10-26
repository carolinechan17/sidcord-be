"use strict";
const { Model, DATE } = require("sequelize");
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
          name: "cartId",
        },
        as: "cartItems",
      });
    }
  }
  carts.init(
    {
      customerUID: DataTypes.INTEGER,
      namaPenerima: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      alamat: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
      totalQuantity: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      namaKurir: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};
