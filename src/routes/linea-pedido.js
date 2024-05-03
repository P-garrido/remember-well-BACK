import { Router } from "express"
import { OrderProductController } from "../controllers/linea-pedido.js";
import { validateToken } from "../middlewares/token.js";


export const createOrderProductRouter = ({ orderProductModel }) => {

  const orderProductRouter = Router();
  const orderProductController = new OrderProductController({ orderProductModel });

  orderProductRouter.get('', validateToken, orderProductController.getAll);
  orderProductRouter.post('', validateToken, orderProductController.create);

  return orderProductRouter;

}