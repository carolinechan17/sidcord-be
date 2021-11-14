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
          type: DataTypes.INTEGER,
        },
        sourceKey: "id",
        as: "cartItems",
      });
      carts.belongsTo(models.sellers, {
        foreignKey: {
          name: "sellerUID",
          type: DataTypes.UUID,
        },
        targetKey: "uid",
        as: "seller",
      });
    }
  }
  carts.init(
    {
      orderId: DataTypes.INTEGER,
      ongkir: DataTypes.INTEGER,
      kurirId: DataTypes.STRING,
      sellerUID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};
