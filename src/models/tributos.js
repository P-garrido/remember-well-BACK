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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Anónimo'
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


