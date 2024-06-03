import { ProductFilesModel } from "../models/archivos-producto.js";
import { OrderProductsModel } from "../models/linea-pedido.js";
import { ProductModel } from "../models/productos.js";
import { UserModel } from "../models/usuarios.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';
import { or } from "sequelize";

config();

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

      const items = [];

      req.body.forEach((lp) => {
        items.push({
          id: lp.product.id,
          title: lp.product.name,
          description: lp.product.description,
          unit_price: Number(lp.product.price),
          quantity: Number(lp.quantity),
          currency_id: 'ARS'
        })
      });

      const body = {
        items: items,
        back_urls: {
          success: 'http://localhost:4200/paymentSuccess',
          failure: 'http://localhost:4200/inicio',
          pending: 'http://localhost:4200/productos'
        },
        auto_return: 'approved',
        notification_url: 'https://039c-181-110-48-149.ngrok-free.app/orders/webhook', //CAMBIAR CADA VEZ Q INICIO NGROK
      };

      const preference = new Preference(client);

      const result = await preference.create({ body });



      res.json(result);
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }


  receiveWebhook = async (req, res) => {


    const topic = req.query.topic;

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
        case 'merchant_order':
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
        }
        else if (data.order_status == 'payment_in_process') {

          console.log('Pago en proceso')
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

