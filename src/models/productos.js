import { DataTypes } from 'sequelize';
import sequelize from './db.js';

export const ProductModel = sequelize.define(
  'Products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  },
  {
    tableName: 'productos',
    timestamps: false,
  }
);