import { DeceasedFilesModel } from "../models/archivos-fallecido.js";
import { UserModel } from "../models/usuarios.js";
import { TributeModel } from "../models/tributos.js";
import fs, { link } from 'fs';
import path, { dirname } from 'path';
import { where } from "sequelize";
import { fileURLToPath } from 'url';
import 'dotenv/config';

const PORT = process.env.PORT
const URL = process.env.URL



export class DeceasedController {

  constructor({ deceasedModel, usersModel }) {
    this.deceasedModel = deceasedModel;
    this.usersModel = usersModel;
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



  getById = async (req, res) => {
    const id = req.params.id;

    try {
      const fallecido = await this.deceasedModel.findOne({ where: { id }, include: [{ model: DeceasedFilesModel }, { model: TributeModel }, { model: UserModel }] });
      let deceasedFiles = [];
      if (fallecido.DeceasedFiles) {
        fallecido.DeceasedFiles.forEach((df) => {
          deceasedFiles.push({
            id: df.id,
            idFall: df.idFall,
            fileUrl: `${URL}/images/${df.fileUrl}`,
            extention: df.extention
          })
        })
      }

      const fallecidoWithProfilePic = {
        id: fallecido.id,
        idOwner: fallecido.idOwner,
        name: fallecido.name,
        birthDate: fallecido.birthDate,
        deathDate: fallecido.deathDate,
        aboutMe: fallecido.aboutMe,
        link: fallecido.link,
        backPicUrl: `${URL}/images/${fallecido.backPicUrl}`,
        profilePicUrl: `${URL}/images/${fallecido.profilePicUrl}`,
        DeceasedFiles: deceasedFiles,
        Tributes: fallecido.Tributes,
        Users: fallecido.Users
      }
      res.json(fallecidoWithProfilePic);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }



  addEditor = async (req, res) => {
    const { mail, idFall } = req.body;

    try {
      const usu = await this.usersModel.findOne({ where: { mail } });
      const fall = await this.deceasedModel.findOne({ where: { id: idFall } });
      fall.addUser(usu);
      res.json({ response: 'Editor agregado' })
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message });
    }
  }


  removeEditor = async (req, res) => {
    const idFall = req.params.idFall;
    const idUsu = req.params.idUsu;

    try {
      const usu = await this.usersModel.findOne({ where: { id: idUsu } });
      const fall = await this.deceasedModel.findOne({ where: { id: idFall } });
      fall.removeUser(usu);
      res.json({ response: 'Editor eliminado' })
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }




  create = async (req, res) => {

    const { idOwner, name, birthDate, deathDate, aboutMe, link, backPicUrl, profilePicUrl } = req.body;


    try {
      const owner = await UserModel.findOne({ where: { id: idOwner } });
      const newFallecido = await this.deceasedModel.create({ idOwner, name, birthDate, deathDate, aboutMe, link, backPicUrl, profilePicUrl });

      newFallecido.addUser(owner);
      res.status(201).json(newFallecido);


    }
    catch (e) {
      console.log(e)
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
      const profPath = path.resolve(__dirname, `../public/${fallecido.profilePicUrl}`);
      const backPath = path.resolve(__dirname, `../public/${fallecido.backPicUrl}`);


      // Verificar si el archivo de imagen existe
      fs.access(profPath, fs.constants.F_OK, async (err) => {
        if (!err) {
          // Eliminar el archivo de imagen del servidor
          fs.unlink(profPath, async (err) => {
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

      // Verificar si el archivo de imagen existe
      fs.access(backPath, fs.constants.F_OK, async (err) => {
        if (!err) {
          // Eliminar el archivo de imagen del servidor
          fs.unlink(backPath, async (err) => {
            if (err) {
              return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
            }
          });
        } else {
          // Si el archivo de imagen no existe, eliminar solo el producto de la base de datos
          res.json({ mensaje: 'No habia portada' });
        }
      });


    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  update = async (req, res) => {
    const id = req.params.id;
    let { name, birthDate, deathDate, aboutMe, link } = req.body;

    if (!deathDate) {
      deathDate = new Date();
    }


    try {

      const fallecido = await this.deceasedModel.findOne({ where: { id } });
      if (!fallecido) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }

      var profilePicUrl = fallecido.profilePicUrl;
      var backPicUrl = fallecido.backPicUrl;


      if (req.files.profPic) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const profilePath = path.resolve(__dirname, `../public/${fallecido.profilePicUrl}`);
        fs.access(profilePath, fs.constants.F_OK, async (err) => {
          if (!err) {
            // Eliminar el archivo de imagen del servidor
            fs.unlink(profilePath, async (err) => {
              if (err) {
                return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
              }
            });
          }
        });
        profilePicUrl = req.files.profPic[0].filename;
      }
      if (req.files.backPic) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const backPath = path.resolve(__dirname, `../public/${fallecido.backPicUrl}`);
        fs.access(backPath, fs.constants.F_OK, async (err) => {
          if (!err) {
            // Eliminar el archivo de imagen del servidor
            fs.unlink(backPath, async (err) => {
              if (err) {
                return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
              }
            });
          }
        });
        backPicUrl = req.files.backPic[0].filename;
      }
      await this.deceasedModel.update({ name, birthDate, deathDate, aboutMe, link, backPicUrl, profilePicUrl }, { where: { id } });
      res.json("Perfil actualizado");

    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}