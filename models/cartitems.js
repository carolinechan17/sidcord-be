"use strict";
const { database } = require("firebase-admin");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cartItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cartItems.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sellerUID: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      description: DataTypes.STRING,
      cartId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "cartItems",
    }
  );
  return cartItems;
};
