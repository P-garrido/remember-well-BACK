import { Router } from "express"
import { TributeController } from "../controllers/tributos.js";


export const createTribureRouter = ({ tributeModel }) => {


  const tributeRouter = Router();
  const tributeController = new TributeController({ tributeModel });

  tributeRouter.get('/:idFall', tributeController.getByDeceased);
  tributeRouter.post('/', tributeController.create);
  tributeRouter.delete('/:id', tributeController.delete);


  return tributeRouter;

}