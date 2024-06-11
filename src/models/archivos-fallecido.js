import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const DeceasedFilesModel = sequelize.define('DeceasedFiles',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    idFall: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    extention: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'archivos_fallecido',
    timestamps: false
  });



