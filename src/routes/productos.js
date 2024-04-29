import { Router } from "express"
import { ProductsController } from "../controllers/productos.js";
import { validateToken } from "../middlewares/token.js";
import { upload } from "../middlewares/multer.js";



export const createProductsRouter = ({ productsModel, productFilesModel }) => {

  const productsRouter = Router();
  const productsController = new ProductsController({ productsModel, productFilesModel });

  productsRouter.get('', productsController.getAll);
  productsRouter.post('', validateToken, upload.array('files', 5), productsController.create);
  productsRouter.patch('/:id', validateToken, upload.array('files', 5), productsController.update);
  productsRouter.delete('/:id', validateToken, productsController.delete);


  return productsRouter;

} 