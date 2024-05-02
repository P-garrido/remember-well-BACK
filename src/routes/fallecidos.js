import { DeceasedController } from "../controllers/fallecidos.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express"


export const createDeceasedRouter = ({ deceasedModel }) => {

  const deceasedRouter = Router();
  const deceasedController = new DeceasedController({ deceasedModel });

  deceasedRouter.get('', deceasedController.getAll);
  deceasedRouter.post('', upload.single('file'), deceasedController.create);
  deceasedRouter.patch('/:id', upload.single('file'), deceasedController.update);
  deceasedRouter.delete('/:id', deceasedController.delete);

  return deceasedRouter
}