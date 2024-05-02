import { DeceasedFilesModel } from "../models/archivos-fallecido.js";
import { TributeModel } from "../models/tributos.js";



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

    const { name, deathDate, aboutMe, playlist } = req.body;
    const profilePicUrl = req.file.filename;

    try {
      const newFallecido = await this.deceasedModel.create({ name, deathDate, aboutMe, playlist, profilePicUrl });
      res.status(201).json(newFallecido);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  delete = async (req, res) => {
    const id = reeq.params.id;

    try {
      const deleted = await this.deceasedModel.destroy({ where: { id } });
      if (deleted > 0) {
        res.json("Perfil eliminado");
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  update = async (req, res) => {
    const id = reeq.params.id;
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
        await this.deceasedModel.update({ name, deathDate, aboutMe, playlist, profilePicUrl });
        res.json("Perfil actualizado");
      }
      else {
        await this.deceasedModel.update({ name, deathDate, aboutMe, playlist });
        res.json("Perfil actualizado");
      }




    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}