import sequelize from "./db.js";
import { DataTypes } from "sequelize";;



export const OrdersModel = sequelize.define(
  'Orders',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: false
    },
    idFall: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    floor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    appartament: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    payed: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No pagado'
    }
  },
  {
    tableName: 'pedidos',
    timestamps: false
  }
);

