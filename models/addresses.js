"use strict";
const { database } = require("firebase-admin");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  addresses.init(
    {
      customerUID: DataTypes.STRING,
      sellerUID: DataTypes.STRING,
      provinsi: DataTypes.STRING,
      city: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      notelp: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "addresses",
    }
  );
  return addresses;
};
