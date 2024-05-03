import { Router } from "express"
import { TributeController } from "../controllers/tributos.js";
import { validateToken } from "../middlewares/token.js";


export const createTribureRouter = ({ tributeModel }) => {


  const tributeRouter = Router();
  const tributeController = new TributeController({ tributeModel });

  tributeRouter.get('/:idFall', tributeController.getByDeceased);
  tributeRouter.post('/', tributeController.create);
  tributeRouter.delete('/:id', validateToken, tributeController.delete);


  return tributeRouter;

}