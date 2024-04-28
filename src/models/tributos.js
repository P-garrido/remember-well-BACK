import sequelize from "./db.js";
import { DataTypes } from "sequelize";


export const TributeModel = sequelize.define('Tribute',
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
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'tributos',
    timestamps: false
  });


