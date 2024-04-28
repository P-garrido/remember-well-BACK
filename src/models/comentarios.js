import sequelize from "./db.js";
import { DataTypes } from "sequelize";

export const CommentModel = sequelize.define('Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'comentarios',
    timestamps: false
  })