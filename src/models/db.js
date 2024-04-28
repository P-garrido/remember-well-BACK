import { Sequelize } from "sequelize";
import 'dotenv/config';

const PASSWORD = process.env.PASSWORD

const sequelize = new Sequelize('remember-well', 'root', PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});


export default sequelize;