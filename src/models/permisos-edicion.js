import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const EditionPermitModel = sequelize.define('EditionPermit',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idUsu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idFall: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'permiso-edicion',
    timestamps: false
  })