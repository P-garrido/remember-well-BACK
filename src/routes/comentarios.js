import { Router } from "express"
import { CommentsController } from "../controllers/comentarios.js";
import { validateToken } from "../middlewares/token.js";


export const createCommentsRouter = ({ commentsModel }) => {

  const commentsRouter = Router();
  const commentsController = new CommentsController({ commentsModel });

  commentsRouter.get('', commentsController.getAll);
  commentsRouter.post('', validateToken, commentsController.create);
  commentsRouter.delete('/:id', validateToken, commentsController.delete);

  return commentsRouter;


}