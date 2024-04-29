import { Router } from "express"
import { ProductsController } from "../controllers/productos.js";
import { validateToken } from "../middlewares/token.js";



export const createProductsRouter = ({ productsModel }) => {

  const productsRouter = Router();
  const productsController = new ProductsController({ productsModel });

  productsRouter.get('', productsController.getAll);
  productsRouter.post('', validateToken, productsController.create);
  productsRouter.patch('/:id', validateToken, productsController.update);
  productsRouter.delete('/:id', validateToken, productsController.delete);


  return productsRouter;

} 