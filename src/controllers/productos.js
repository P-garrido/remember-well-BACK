import { where } from "sequelize";



export class ProductsController {

  constructor({ productsModel, productFilesModel }) {
    this.productsModel = productsModel;
    this.productFilesModel = productFilesModel;
  }


  getAll = async (req, res) => {

    try {
      const products = await this.productsModel.findAll({ include: [{ model: this.productFilesModel }] });
      res.json(products);
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  create = async (req, res) => {

    const { name, description, price } = req.body;

    try {
      const newProd = await this.productsModel.create({ name, description, price });

      for (const file of req.files) {
        await this.productFilesModel.create({ idProd: newProd.id, fileUrl: file.filename });
      }
      res.json(newProd);
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
      const updatedProd = await this.productsModel.update({ name, description, price }, { where: { id } });
      if (updatedProd > 0) {
        res.json({ response: 'Producto actualizado' })
      }
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.productsModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json({ response: 'Producto eliminado' });
      }
    }
    catch (e) {
      res.status(500).json({ error: e })
    }

  }

}