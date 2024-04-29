import { Router } from "express";
import { UsersController } from "../controllers/usuarios.js";


export const createUsersRouter = ({ usersModel }) => {

  const usersRouter = new Router();

  const usersController = new UsersController({ usersModel });

  usersRouter.get('/', usersController.getAll);
  usersRouter.post('/', usersController.create);
  usersRouter.patch('/:id', usersController.update);
  usersRouter.delete('/:id', usersController.delete);


  return usersRouter


}