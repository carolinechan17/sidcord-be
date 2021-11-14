"use strict";
const { database } = require("firebase-admin");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payments.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      data: DataTypes.TEXT,
      cartId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "payments",
    }
  );
  return payments;
};
