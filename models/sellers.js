"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sellers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sellers.hasMany(models.products, {
        foreignKey: {
          name: "sellerUID",
          type: DataTypes.UUID,
        },
        sourceKey: "uid",
        as: "products",
      });
    }
  }
  sellers.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      photoURL: DataTypes.STRING,
      uid: DataTypes.STRING,
      bio: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sellers",
    }
  );
  return sellers;
};
