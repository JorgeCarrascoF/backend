const Comment = require('../models/comment');
const boom = require('@hapi/boom');

class CommentService {
    async createDocument(commentData) {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    }

    async getAllComments() {
        return await Comment.find()
        .populate('userId', 'fullName email')
        .populate('logId');
    }

    async getDocumentById(id) {
        const comment = await Comment.findById(id)
        .populate('userId', 'fullName email')
        .populate('logId');
        if (!comment) {
            throw boom.notFound('Comment no encontrado');
        }
        return document;
    }

    async updateComment(id, updateData) {
        const comment = await Comment.findByIdAndUpdate(id, updateData, { new: true })
        .populate('userId', 'fullName email')
        .populate('logId', 'message');
        if (!comment) {
            throw boom.notFound('Comment no encontrado');
        }
        return comment;
    }

    async deleteComment(id) {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            throw boom.notFound('Comment no encontrado');
        }
        return comment;
    }
}

module.exports = new CommentService();
