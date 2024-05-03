import { EditionPermitController } from "../controllers/permisos-edicion.js";
import { Router } from "express";

export const createEditionPermitRouter = ({ editionPermitModel }) => {

  const editionPermitRouter = Router();
  const editionPermitController = new EditionPermitController({ editionPermitModel });


  editionPermitRouter.get('/:idUser', editionPermitController.getByUser)
  editionPermitRouter.post('/', editionPermitController.create);
  editionPermitRouter.delete('/:id', editionPermitController.delete);


  return editionPermitRouter;
}