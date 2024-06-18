import { ProductFilesModel } from "../models/archivos-producto.js";
import { OrderProductsModel } from "../models/linea-pedido.js";
import { ProductModel } from "../models/productos.js";
import { UserModel } from "../models/usuarios.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';
import { or } from "sequelize";
import { DeceasedModel } from "../models/fallecidos.js";

config();

const URL = process.env.URL;

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
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

  getFromUser = async (req, res) => {
    const id = req.params.idUser;

    try {
      const pedidos = await this.ordersModel.findAll({ where: { idUser: id } });
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

    const { idUser, cart, province, city, zipCode, address, floor, appartament } = req.body;

    try {

      const items = [];
      let total = 0;

      cart.forEach((lp) => {
        items.push({
          id: lp.product.id,
          title: lp.product.name,
          description: lp.product.description,
          unit_price: Number(lp.product.price),
          quantity: Number(lp.quantity),
          currency_id: 'ARS'
        });
        total += lp.product.price * lp.quantity;
      });

      const body = {
        items: items,
        back_urls: {
          success: `${URL}/paymentSuccess`,
          failure: `${URL}/paymentFailure`,
          pending: `${URL}/paymentPending`
        },
        auto_return: 'approved',
        notification_url: `${URL}/orders/webhook`, //CAMBIAR CADA VEZ Q INICIO NGROK
      };

      const preference = new Preference(client);

      const result = await preference.create({ body });


      const ord = await this.ordersModel.create({ paymentId: result.id, date: new Date(), idUser, total: total, province, city, zipCode, address, floor, appartament, delivered: false })
      items.forEach(async (item) => {
        await OrderProductsModel.create({ idPed: ord.id, idProd: item.id, cantidad: item.quantity });
      });

      res.json(result);
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }


  receiveWebhook = async (req, res) => {


    const topic = req.query.topic;
    console.log(req.query)

    try {

      var payment;
      var merchantOrder;
      switch (topic) {
        case 'payment':
          const paymentId = req.query.id;
          payment = await fetch('https://api.mercadopago.com/v1/payments/' + paymentId, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + process.env.MP_ACCESS_TOKEN
            }
          });
          if (payment.ok) {
            const data = await payment.json();
            merchantOrder = await fetch('https://api.mercadopago.com/merchant_orders/' + data.order.id, {
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + process.env.MP_ACCESS_TOKEN
              }
            });
          }
          break;
        case 'merchant_order': //SI FUNCIONA ASÍ BORRARLO
          // const orderId = req.query.id;
          // merchantOrder = await fetch('https://api.mercadopago.com/merchant_orders/' + orderId, {
          //   method: 'GET',
          //   headers: {
          //     'Authorization': 'Bearer ' + process.env.MP_ACCESS_TOKEN
          //   }
          // });
          break;
      }

      if (merchantOrder) {
        const data = await merchantOrder.json();

        var paidAmount = 0;
        data.payments.forEach((payment) => {
          if (payment.status === 'approved') {
            paidAmount += payment.transaction_amount;
          }
        });

        if (paidAmount >= data.total_amount && data.status === 'closed') {
          console.log('Pago completo')
          //Actualizar pedido
          const order = await this.ordersModel.findOne({ where: { paymentId: data.preference_id } });
          await this.ordersModel.update({ payed: 'Pagado' }, { where: { paymentId: data.preference_id } });

          const newFallecido = await DeceasedModel.create({ idOwner: order.idUser });
          const owner = await UserModel.findOne({ where: { id: order.idUser } });
          newFallecido.addUser(owner);

        }
        else if (data.order_status == 'payment_in_process') {

          console.log('Pago en proceso')
          const order = await this.ordersModel.findOne({ where: { paymentId: data.preference_id } });
          await this.ordersModel.update({ payed: 'En proceso' }, { where: { paymentId: data.preference_id } });
        }
        else {
          console.log('Pago incompleto')
        }
        res.sendStatus(200);

      }
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }

}

