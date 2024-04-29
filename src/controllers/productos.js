import { where } from "sequelize";



export class ProductsController {

  constructor({ productsModel }) {
    this.productsModel = productsModel;
  }


  getAll = async (req, res) => {

    try {
      const products = await this.productsModel.findAll();
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
      res.json(newProd);
    }
    catch (e) {
      res.status(500).json({ error: e })
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