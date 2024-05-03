import { Router } from "express"
import { DeceasedFilesController } from "../controllers/archivos-fallecido.js";
import { upload } from "../middlewares/multer.js";
import { validateToken } from "../middlewares/token.js";


export const createDeceasedFilesRouter = ({ deceasedFilesModel }) => {

  const deceasedFilesRouter = Router();
  const deceasedFilesController = new DeceasedFilesController({ deceasedFilesModel });


  deceasedFilesRouter.post('', validateToken, upload.single('file'), deceasedFilesController.create);
  deceasedFilesRouter.delete('/:id', validateToken, deceasedFilesController.delete);

  return deceasedFilesRouter
}