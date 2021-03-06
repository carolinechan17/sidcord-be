"use strict";
const { Model } = require("sequelize");
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
          name: "orderId",
          type: DataTypes.INTEGER,
        },
        sourceKey: "id",
        as: "carts",
      });
      orders.belongsTo(models.addresses, {
        foreignKey: {
          name: "alamatId",
        },
        targetKey: "id",
        as: "alamat",
      });
    }
  }
  orders.init(
    {
      customerUID: DataTypes.STRING,
      alamatId: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      totalQuantity: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
