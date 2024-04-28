import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const ProductFilesModel = sequelize.define('ProductFiles',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    idProd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'archivos-producto',
    timestamps: false
  })