import sequelize from "./db.js";
import { DataTypes } from "sequelize";



export const DeceasedModel = sequelize.define('Deceased',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    idOwner: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deathDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    aboutMe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    playlist: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'fallecidos',
    timestamps: false
  });


