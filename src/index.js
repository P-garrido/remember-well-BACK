import cors from 'cors';
import express, { json } from 'express';
import { config } from 'dotenv';
import { UserModel } from './models/usuarios.js';
import { OrdersModel } from './models/pedidos.js';
import { OrderProductsModel } from './models/linea-pedido.js';
import { DeceasedFilesModel } from './models/archivos-fallecido.js';
import { ProductFilesModel } from './models/archivos-producto.js';
import { DeceasedModel } from './models/fallecidos.js';
import { EditionPermitModel } from './models/permisos-edicion.js';
import { ProductModel } from './models/productos.js';
import { TributeModel } from './models/tributos.js';
import sequelize from './models/db.js';


const app = express();

app.use(cors());
app.use(json());
config();



// DEFININCIÓN DE RELACIONES ENTRE TABLAS
UserModel.hasMany(OrdersModel, { foreignKey: 'idUser', onDelete: 'CASCADE' });
OrdersModel.belongsTo(UserModel, { foreignKey: 'idUser' });

UserModel.belongsToMany(DeceasedModel, { through: EditionPermitModel, foreignKey: 'idUsu', onDelete: 'CASCADE' });
DeceasedModel.belongsToMany(UserModel, { through: EditionPermitModel, foreignKey: 'idFall' });

DeceasedModel.hasMany(DeceasedFilesModel, { foreignKey: 'idFall', onDelete: 'CASCADE' });
DeceasedFilesModel.belongsTo(DeceasedModel, { foreignKey: 'idFall' });

DeceasedModel.hasMany(TributeModel, { foreignKey: 'idFall', onDelete: 'CASCADE' });
TributeModel.belongsTo(DeceasedModel, { foreignKey: 'idFall' });

OrdersModel.hasMany(OrderProductsModel, { foreignKey: 'idPed', onDelete: 'CASCADE' });
OrderProductsModel.belongsTo(OrdersModel, { foreignKey: 'idPed' });

ProductModel.hasMany(OrderProductsModel, { foreignKey: 'idProd', onDelete: 'CASCADE' });
OrderProductsModel.belongsTo(ProductModel, { foreignKey: 'idProd' });

ProductModel.hasMany(ProductFilesModel, { foreignKey: 'idProd', onDelete: 'CASCADE' });
ProductFilesModel.belongsTo(ProductModel, { foreignKey: 'idProd' });





//FUNCIÓN QUE SE LLAMA A SI MISMA PARA SINCRONIZAR EL MODELO CON LA BD
(async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();

    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();



const port = process.env.PORT;

app.listen(port, () => {
  console.log("app listening on port", port)
});