import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const OrderProductsModel = sequelize.define(
  'OrderProducts',
  {
    idPed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idProd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'linea-pedidos',
    timestamps: false
  }
);


