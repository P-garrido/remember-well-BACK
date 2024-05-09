import { EditionPermitController } from "../controllers/permisos-edicion.js";
import { Router } from "express";
import { validateToken } from "../middlewares/token.js";

export const createEditionPermitRouter = ({ editionPermitModel }) => {

  const editionPermitRouter = Router();
  const editionPermitController = new EditionPermitController({ editionPermitModel });


  editionPermitRouter.get('/:idUser', validateToken, editionPermitController.getByUser)
  editionPermitRouter.post('/', validateToken, editionPermitController.create);
  editionPermitRouter.delete('/:id', validateToken, editionPermitController.delete);


  return editionPermitRouter;
}

