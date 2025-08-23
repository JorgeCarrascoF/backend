const Comment = require('../models/comment');
const boom = require('@hapi/boom');

class CommentService {
    async createDocument(commentData) {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    }

    getAllComments = async (pagination) => {
        const { limit, skip } = pagination;
        const query = {};
        const comments = await Comment.find(query)
            .populate("userId", "fullName email")
            .populate('logId')
            .skip(skip)
            .limit(limit)
            .sort({ create_at: -1 });

        const totalComments = await Comment.countDocuments(query);

        return {
            data: comments.map((comment) => ({
                id: comment._id,
                text: comment.text,
                pinned: comment.pinned,
                userId: comment.userId,
                logId: comment.logId,
                create_at: comment.create_at
            })),
            total: totalComments,
        };

    }

    async getDocumentById(id) {
        const comment = await Comment.findById(id)
            .populate('userId', 'fullName email')
            .populate('logId');
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        return document;
    }

    async getCommentsByLog(logId, { limit, skip }) {
        const query = { logId }; // 👈 filtramos por logId

        const comments = await Comment.find(query)
            .populate("userId", "fullName email")
            .populate("logId")
            .skip(skip)
            .limit(limit)
            .sort({ create_at: -1 });

        const total = await Comment.countDocuments(query);

        return {
            data: comments.map(c => ({
                id: c._id,
                text: c.text,
                pinned: c.pinned,
                user: c.userId,
                log: c.logId,
                create_at: c.create_at
            })),
            total
        };
    }


    async updateComment(id, updateData) {
        const comment = await Comment.findByIdAndUpdate(id, updateData, { new: true })
            .populate('userId', 'fullName email')
            .populate('logId', 'message');
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        return comment;
    }

    async deleteComment(id) {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            throw boom.notFound('Comment not found');
        }
        return comment;
    }
}

module.exports = new CommentService();
