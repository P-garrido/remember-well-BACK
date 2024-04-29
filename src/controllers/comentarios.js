import { where } from "sequelize";



export class CommentsController {

  constructor({ commentsModel }) {
    this.commentsModel = commentsModel;
  }

  getAll = async (req, res) => {

    try {
      const comments = await this.commentsModel.findAll();
      res.json(comments);
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  create = async (req, res) => {

    const { text, stars } = req.body;

    try {

      const newComment = await this.commentsModel.create({ text, stars });
      res.json(newComment)
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  delete = async (req, res) => {
    const id = req.params.id;

    try {
      const deleted = await this.commentsModel.destroy({ where: { id } });
      res.json({ response: "Comentario eliminado" });
    }
    catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}