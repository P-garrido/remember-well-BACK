import { DeceasedFilesModel } from "../models/archivos-fallecido.js";
import { TributeModel } from "../models/tributos.js";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';



export class DeceasedController {

  constructor({ deceasedModel }) {
    this.deceasedModel = deceasedModel;
  }


  getAll = async (req, res) => {

    try {
      const fallecidos = await this.deceasedModel.findAll({ include: [{ model: DeceasedFilesModel }, { model: TributeModel }] });
      res.json(fallecidos);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }




  create = async (req, res) => {

    const { idOwner, name, deathDate, aboutMe, playlist } = req.body;


    try {
      if (req.file) {
        const profilePicUrl = req.file.filename;
        const newFallecido = await this.deceasedModel.create({ idOwner, name, deathDate, aboutMe, playlist, profilePicUrl });
        res.status(201).json(newFallecido);
      }
      else {
        const newFallecido = await this.deceasedModel.create({ idOwner, name, deathDate, aboutMe, playlist });
        res.status(201).json(newFallecido);
      }

    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  delete = async (req, res) => {
    const id = req.params.id;

    try {

      // Buscar el perfil en la base de datos para obtener el nombre del archivo de imagen
      const fallecido = await this.deceasedModel.findOne({ where: { id } });
      if (!fallecido) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }

      const __dirname = dirname(fileURLToPath(import.meta.url));

      // Ruta del archivo de imagen en el servidor
      const filePath = path.resolve(__dirname, `../public/${fallecido.profilePicUrl}`);

      // Verificar si el archivo de imagen existe
      fs.access(filePath, fs.constants.F_OK, async (err) => {
        if (!err) {
          // Eliminar el archivo de imagen del servidor
          fs.unlink(filePath, async (err) => {
            if (err) {
              return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
            }
            // Eliminar el producto de la base de datos después de eliminar el archivo
            await this.deceasedModel.destroy({ where: { id } });
            res.json({ mensaje: 'Perfil y archivo eliminados correctamente' });
          });
        } else {
          // Si el archivo de imagen no existe, eliminar solo el producto de la base de datos
          await this.deceasedModel.destroy({ where: { id } });
          res.json({ mensaje: 'Perfil eliminado correctamente' });
        }
      });



    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  update = async (req, res) => {
    const id = req.params.id;
    const { name, deathDate, aboutMe, playlist } = req.body;


    try {

      const fallecido = await this.deceasedModel.findOne({ where: { id } });
      if (!fallecido) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }


      if (req.file) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const filePath = path.resolve(__dirname, `../public/${fallecido.profilePicUrl}`);
        fs.access(filePath, fs.constants.F_OK, async (err) => {
          if (!err) {
            // Eliminar el archivo de imagen del servidor
            fs.unlink(filePath, async (err) => {
              if (err) {
                return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
              }
            });
          }
        });
        const profilePicUrl = req.file.filename;
        await this.deceasedModel.update({ name, deathDate, aboutMe, playlist, profilePicUrl }, { where: { id } });
        res.json("Perfil actualizado");
      }
      else {
        await this.deceasedModel.update({ name, deathDate, aboutMe, playlist }, { where: { id } });
        res.json("Perfil actualizado");
      }




    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}