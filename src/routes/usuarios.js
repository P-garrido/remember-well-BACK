import { Router } from "express";
import { UsersController } from "../controllers/usuarios.js";
import { validateToken } from "../middlewares/token.js";


export const createUsersRouter = ({ usersModel }) => {

  const usersRouter = new Router();

  const usersController = new UsersController({ usersModel });

  usersRouter.get('/', validateToken, usersController.getAll);
  usersRouter.get('/:id', validateToken, usersController.getOne);
  usersRouter.post('/', usersController.create);
  usersRouter.patch('/:id', validateToken, usersController.update);
  usersRouter.delete('/:id', validateToken, usersController.delete);
  usersRouter.post('/login', usersController.login);


  return usersRouter


}