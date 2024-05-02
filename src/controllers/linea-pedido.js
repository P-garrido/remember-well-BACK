import { ProductFilesModel } from "../models/archivos-producto.js";
import { ProductModel } from "../models/productos.js";


export class OrderProductController {

  constructor({ orderProductModel }) {
    this.orderProductModel = orderProductModel;
  }

  getAll = async (req, res) => {

    try {
      const lineasPedido = await this.orderProductModel.findAll({ include: { model: ProductModel, include: { model: ProductFilesModel } } });
      res.json(lineasPedido);
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  create = async (req, res) => {

    const { idPed, idProd, cantidad } = req.body;

    try {
      const newLineaPedido = await this.orderProductModel.create({ idPed, idProd, cantidad });
      res.status(201).json(newLineaPedido);
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}