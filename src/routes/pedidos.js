import { Router } from "express"
import { OrdersController } from "../controllers/pedidos.js";
import { validateToken } from "../middlewares/token.js";


export const createOrdersRouter = ({ ordersModel }) => {

  const ordersRouter = Router();
  const ordersController = new OrdersController({ ordersModel });


  ordersRouter.get('', ordersController.getAll);
  ordersRouter.post('', ordersController.create);
  ordersRouter.patch('/:id', ordersController.update);
  ordersRouter.delete('/:id', ordersController.delete);

  return ordersRouter;
}