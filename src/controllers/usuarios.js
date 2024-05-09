import { where } from "sequelize";
import { generateToken } from "../middlewares/token.js";
import { DeceasedModel } from "../models/fallecidos.js";
import { DeceasedFilesModel } from "../models/archivos-fallecido.js";
import { TributeModel } from "../models/tributos.js";
import { UserModel } from "../models/usuarios.js";


export class UsersController {

  constructor({ usersModel }) {
    this.usersModel = usersModel;
  }

  getAll = async (req, res) => {

    try {
      const usuarios = await this.usersModel.findAll({ include: { model: DeceasedModel } });

      res.json(usuarios)
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  getOne = async (req, res) => {
    const id = req.params.id;

    try {
      const usuario = await this.usersModel.findOne({ include: { model: DeceasedModel, include: [{ model: DeceasedFilesModel }, { model: UserModel }, { model: TributeModel }] } }, { where: { id } });

      res.json(usuario)
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  create = async (req, res) => {

    const { mail, name, password, phone, admin } = req.body;

    try {
      const newUser = await this.usersModel.create({ mail, name, password, phone, admin });

      if (newUser) {
        const payload = {
          mail: newUser.mail,
          password: newUser.password,
        };
        const token = generateToken(payload);
        res.json({ token, newUser });
      } else {
        res.status(404).send({ message: 'user not found' });
      }

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
      await this.usersModel.update({ mail, name, password, phone, admin }, { where: { id } });

      res.json({ response: 'Usuario actualizado' });

    }
    catch (e) {
      res.status(500).json({ error: e })
    }
  }


  login = async (req, res) => {

    const { mail, password } = req.body;
    try {
      const user = await this.usersModel.findOne({ include: { model: DeceasedModel } }, { where: { mail, password } });


      if (user) {
        const payload = {
          mail: mail,
          password: password,
        };
        const token = generateToken(payload);
        res.json({ token, user });
      } else {
        res.status(404).send({ message: 'user not found' });
      }
    }

    catch (err) {
      res.status(500).json({ error: err })
    }

  }
}