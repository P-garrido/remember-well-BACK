import { DeceasedController } from "../controllers/fallecidos.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express"
import { validateToken } from "../middlewares/token.js";


export const createDeceasedRouter = ({ deceasedModel, usersModel }) => {

  const deceasedRouter = Router();
  const deceasedController = new DeceasedController({ deceasedModel, usersModel });

  deceasedRouter.get('', validateToken, deceasedController.getAll);
  deceasedRouter.get('/:id', deceasedController.getById);
  deceasedRouter.post('', validateToken, upload.fields([{ name: 'profPic', maxCount: 1 }, { name: 'backPic', maxCount: 1 }]), deceasedController.create);
  deceasedRouter.patch('/:id', validateToken, upload.fields([{ name: 'profPic', maxCount: 1 }, { name: 'backPic', maxCount: 1 }]), deceasedController.update);
  deceasedRouter.delete('/:id', validateToken, deceasedController.delete);
  deceasedRouter.post('/editors', validateToken, deceasedController.addEditor);
  deceasedRouter.delete('/editors/:idFall/:idUsu', validateToken, deceasedController.removeEditor);

  return deceasedRouter
}

