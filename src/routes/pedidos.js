import { Router } from "express"
import { OrdersController } from "../controllers/pedidos.js";
import { validateToken } from "../middlewares/token.js";


export const createOrdersRouter = ({ ordersModel }) => {

  const ordersRouter = Router();
  const ordersController = new OrdersController({ ordersModel });


  ordersRouter.get('', validateToken, ordersController.getAll);
  ordersRouter.post('', validateToken, ordersController.create);
  ordersRouter.patch('/:id', validateToken, ordersController.update);
  ordersRouter.delete('/:id', validateToken, ordersController.delete);
  ordersRouter.post('/payments', validateToken, ordersController.createPayment);

  return ordersRouter;
}