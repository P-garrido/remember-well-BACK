import { Op, where } from "sequelize";
import { DeceasedFilesModel } from "../models/archivos-fallecido.js";
import { DeceasedModel } from "../models/fallecidos.js";
import { TributeModel } from "../models/tributos.js";


export class EditionPermitController {

  constructor({ editionPermitModel }) {
    this.editionPermitModel = editionPermitModel;
  }



  getByUser = async (req, res) => { //VER COMO DAR/REVOCAR PERMISOS
    const idUsu = req.params.idUser;
    try {
      const permisosEdicion = await this.editionPermitModel.findAll({ where: { idUsu } });
      res.json(permisosEdicion);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  create = async (req, res) => {

    const { idUsu, idFall } = req.body;

    try {
      const newPermisoEdicion = await this.editionPermitModel.create({ idUsu, idFall });
      res.status(201).json(newPermisoEdicion);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.editionPermitModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json({ response: "Permiso eliminado" });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}