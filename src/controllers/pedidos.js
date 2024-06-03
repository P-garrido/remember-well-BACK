import { ProductFilesModel } from "../models/archivos-producto.js";
import { OrderProductsModel } from "../models/linea-pedido.js";
import { ProductModel } from "../models/productos.js";
import { UserModel } from "../models/usuarios.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';


const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-7841453800054411-032312-ae524ed295d1ebe14b339fd3974ab801-1741049380'
});




export class OrdersController {

  constructor({ ordersModel }) {
    this.ordersModel = ordersModel;
  }


  getAll = async (req, res) => {

    try {
      const pedidos = await this.ordersModel.findAll({ include: [{ model: OrderProductsModel, include: { model: ProductModel } }, { model: UserModel }] }); //CHEQUEAR Q OP TRAIGA SU PRODUCTO
      res.json(pedidos);
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  create = async (req, res) => {
    const { idUser, date, total, province, city, zipCode, address, floor, appartament, delivered } = req.body;

    try {
      const newPedido = await this.ordersModel.create({ idUser, date, total, province, city, zipCode, address, floor, appartament, delivered });
      res.status(201).json(newPedido);

    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.ordersModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json({ response: 'Pedido eliminado' });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  update = async (req, res) => {
    const id = req.params.id;
    const { idUser, date, total, province, city, zipCode, address, floor, appartament, delivered } = req.body;


    try {

      await this.ordersModel.update({ idUser, date, total, province, city, zipCode, address, floor, appartament, delivered }, { where: { id } });
      res.json({ response: 'Pedido actualizado' })
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  createPayment = async (req, res) => {




    try {

      const preference = new Preference(client);

      const items = [];

      req.body.forEach((lp) => {
        items.push({
          title: lp.product.name,
          unit_price: parseInt(lp.product.price),
          quantity: parseInt(lp.quantity),
          currency_id: 'ARS'
        })
      });

      const paymentRequest = await preference.create({
        body: {
          items: items,
          notification_url: 'https://3c16-181-110-48-149.ngrok-free.app/orders/webhook', //NO SE COMO SE USA
          back_urls: {
            success: 'http://localhost:4200/paymentSuccess',
            failure: 'http://localhost:4200/inicio',
            pending: 'http://localhost:4200/inicio'
          }
        },
      });
      res.json(paymentRequest);
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }


  receiveWebhook = async (req, res) => {

    try {



      if (req.query.topic === 'payment') {
        console.log('pago')
      }


      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }







}