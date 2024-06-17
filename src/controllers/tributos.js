import { where } from "sequelize";


export class TributeController {

  constructor({ tributeModel }) {
    this.tributeModel = tributeModel;
  }


  getByDeceased = async (req, res) => {
    const idFall = req.params.idFall;

    try {
      const tributos = await this.tributeModel.findAll({ where: { idFall } });
      res.json(tributos);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  create = async (req, res) => {
    const { idFall, text, name } = req.body;

    try {
      const newTributo = await this.tributeModel.create({ idFall, text, name });
      res.status(201).json(newTributo);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.tributeModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json({ response: "Tributo eliminado" });
      }
      else {
        res.json({ response: "Tributo no encontrado" });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}