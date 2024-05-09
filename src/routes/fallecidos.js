import { DeceasedController } from "../controllers/fallecidos.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express"
import { validateToken } from "../middlewares/token.js";


export const createDeceasedRouter = ({ deceasedModel }) => {

  const deceasedRouter = Router();
  const deceasedController = new DeceasedController({ deceasedModel });

  deceasedRouter.get('', validateToken, deceasedController.getAll);
  deceasedRouter.get('/:id', validateToken, deceasedController.getById);
  deceasedRouter.post('', validateToken, upload.single('file'), deceasedController.create);
  deceasedRouter.patch('/:id', validateToken, upload.single('file'), deceasedController.update);
  deceasedRouter.delete('/:id', validateToken, deceasedController.delete);

  return deceasedRouter
}

