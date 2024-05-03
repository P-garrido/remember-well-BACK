import { Router } from "express"
import { DeceasedFilesController } from "../controllers/archivos-fallecido.js";
import { upload } from "../middlewares/multer.js";


export const createDeceasedFilesRouter = ({ deceasedFilesModel }) => {

  const deceasedFilesRouter = Router();
  const deceasedFilesController = new DeceasedFilesController({ deceasedFilesModel });


  deceasedFilesRouter.post('', upload.single('file'), deceasedFilesController.create);
  deceasedFilesRouter.delete('/:id', deceasedFilesController.delete);

  return deceasedFilesRouter
}