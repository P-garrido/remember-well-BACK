import { where } from "sequelize";



export class UsersController {

  constructor({ usersModel }) {
    this.usersModel = usersModel;
  }

  getAll = async (req, res) => {

    try {
      const usuarios = await this.usersModel.findAll();

      res.json(usuarios)
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  create = async (req, res) => {

    const { mail, name, password, phone, admin } = req.body;

    try {
      const newUser = await this.usersModel.create({ mail, name, password, phone, admin });
      res.status(201).json(newUser); //FALTA ACTUALIZAR PARA GENERAR EL TOKEN 
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.usersModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json({ response: 'Usuario eliminado' });
      }
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  update = async (req, res) => {
    const id = req.params.id;
    const { mail, name, password, phone, admin } = req.body;

    try {
      const updated = await this.usersModel.update({ mail, name, password, phone, admin }, { where: { id } });
      if (updated > 0) {
        res.json({ response: 'Usuario actualizado' });
      }
    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }
}