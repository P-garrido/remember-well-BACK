import { Sequelize } from "sequelize";
import 'dotenv/config';

const PASSWORD = process.env.PASSWORD

const sequelize = new Sequelize('eternal-moments', 'root', PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});


export default sequelize;