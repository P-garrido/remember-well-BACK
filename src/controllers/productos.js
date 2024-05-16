import { where } from "sequelize";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


export class ProductsController {

  constructor({ productsModel, productFilesModel }) {
    this.productsModel = productsModel;
    this.productFilesModel = productFilesModel;
  }


  getAll = async (req, res) => {

    try {
      const products = await this.productsModel.findAll({ include: [{ model: this.productFilesModel }] });

      const productsWithFiles = products.map(product => {
        let prodFiles = [];
        product.ProductFiles.forEach(pf => {
          prodFiles.push({
            id: pf.id,
            idProd: pf.idProd,
            fileUrl: `http://localhost:3000/images/${pf.fileUrl}`,
            extention: pf.extention
          })
        })
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          ProductFiles: prodFiles
        }
      })
      res.json(productsWithFiles);
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }


  create = async (req, res) => {

    const { name, description, price } = req.body;

    try {
      const newProd = await this.productsModel.create({ name, description, price });

      const newFiles = [];
      for (const file of req.files) {
        const ext = file.originalname.split('.').pop();
        newFiles.push(await this.productFilesModel.create({ idProd: newProd.id, fileUrl: file.filename, extention: ext }));
      }
      res.json({ newProd, newFiles });
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }


  update = async (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;

    try {

      if (req.files.length != 0) {

        const oldFiles = await this.productFilesModel.findAll({ where: { idProd: id } });
        if (oldFiles.length != 0) {
          const __dirname = dirname(fileURLToPath(import.meta.url)); //Busca el nombre del directorio actual
          for (const file of oldFiles) { //borro cada archivo del servidor
            const filePath = path.resolve(__dirname, `../public/${file.fileUrl}`);
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (!err) {
                // Eliminar el archivo de imagen del servidor
                fs.unlink(filePath, async (err) => {
                  if (err) {
                    return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
                  }
                })
              }
            })
          }
          await this.productFilesModel.destroy({ where: { idProd: id } }); //borro los archivos de la bd
        }

      }

      await this.productsModel.update({ name, description, price }, { where: { id } });

      for (const newFile of req.files) {
        const ext = newFile.originalname.split('.').pop();

        await this.productFilesModel.create({ idProd: id, fileUrl: newFile.filename, extention: ext });
      }
      res.json({ response: 'Producto actualizado' })

    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const oldFiles = await this.productFilesModel.findAll({ where: { idProd: id } });
      const deleted = await this.productsModel.destroy({ where: { id } });
      if (deleted > 0) {

        if (oldFiles.length != 0) {
          const __dirname = dirname(fileURLToPath(import.meta.url)); //Busca el nombre del directorio actual
          for (const file of oldFiles) { //borro cada archivo del servidor
            const filePath = path.resolve(__dirname, `../public/${file.fileUrl}`);
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (!err) {
                // Eliminar el archivo de imagen del servidor
                fs.unlink(filePath, async (err) => {
                  if (err) {
                    return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
                  }
                })
              }
            })
          }
        }

        res.json({ response: 'Producto eliminado' });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }

  }

}