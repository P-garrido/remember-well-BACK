import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export class DeceasedFilesController {

  constructor({ deceasedFilesModel }) {
    this.deceasedFilesModel = deceasedFilesModel;
  }




  create = async (req, res) => {
    const { idFall } = req.body;

    try {
      const newFiles = [];
      for (const file of req.files) {
        const ext = file.originalname.split('.').pop();
        newFiles.push(await this.deceasedFilesModel.create({ idFall, fileUrl: file.filename, extention: ext }));
      }
      res.status(201).json(newFiles);
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {

      // Buscar el registro en la base de datos para obtener el nombre del archivo de imagen
      const archivo = await this.deceasedFilesModel.findOne({ where: { id } });
      if (!archivo) {
        return res.status(404).json({ message: "Archivo no encontrado" });
      }

      const __dirname = dirname(fileURLToPath(import.meta.url));

      // Ruta del archivo de imagen en el servidor
      const filePath = path.resolve(__dirname, `../public/${archivo.fileUrl}`);

      // Verificar si el archivo de imagen existe
      fs.access(filePath, fs.constants.F_OK, async (err) => {
        if (!err) {
          // Eliminar el archivo de imagen del servidor
          fs.unlink(filePath, async (err) => {
            if (err) {
              return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
            }
            // Eliminar el registro de la base de datos después de eliminar el archivo
            await this.deceasedFilesModel.destroy({ where: { id } });
            res.json({ mensaje: 'Registro y archivo eliminados correctamente' });
          });
        } else {
          // Si el archivo de imagen no existe, eliminar solo el registro de la base de datos
          await this.deceasedFilesModel.destroy({ where: { id } });
          res.json({ mensaje: 'Registro eliminado correctamente' });
        }
      });


    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}