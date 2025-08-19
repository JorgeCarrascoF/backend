const Comment = require("../models/comment");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../validations/commentSchema.js");
const boom = require("@hapi/boom");

const createComment = async (req, res, next) => {
  try {
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const { text, logId } = req.body;
    const userId = req.user.id;
    const comment = new Comment({ text, userId, logId });
    await comment.save();

    res.status(201).json({
      message: "Comentario creado exitosamente",
      comment,
    });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "fullName email")
      .populate("logId");
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("logId");
    if (!comment) {
      throw boom.notFound("Comentario no encontrado");
    }
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { error } = updateCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true })
      .populate("userId", "fullName email")
      .populate("logId");
    if (!comment) {
      throw boom.notFound("Comment no encontrado");
    }
    res.status(200).json({
      message: "Comment actualizado exitosamente",
      comment,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      throw boom.notFound("Comment no encontrado");
    }
    res.status(200).json({
      message: "Comment eliminado exitosamente",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
