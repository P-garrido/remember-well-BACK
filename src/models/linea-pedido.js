import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const OrderProductsModel = sequelize.define(
  'OrderProducts',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    idPed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idProd: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'linea_pedidos',
    timestamps: false
  }
);


