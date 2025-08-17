const Document = require('../models/document');
const { createDocumentSchema, updateDocumentSchema } = require('../validations/documentSchema');
const boom = require('@hapi/boom');

const createDocument = async (req, res, next) => {
    try {
        const { error } = createDocumentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: error.details.map(detail => detail.message).join(', ')
            });
        }

        const { title, content, log } = req.body;
        const document = new Document({ title, content, log });
        await document.save();

        res.status(201).json({
            message: 'Document created successfully',
            document
        });
    } catch (err) {
        next(err);
    }
};

const getAllDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find().populate('log');
        res.status(200).json(documents);
    } catch (err) {
        next(err);
    }
};

const getDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id).populate('log');
        if (!document) {
            throw boom.notFound('Document not found');
        }
        res.status(200).json(document);
    } catch (err) {
        next(err);
    }
};

const updateDocument = async (req, res, next) => {
    try {
        const { error } = updateDocumentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: error.details.map(detail => detail.message).join(', ')
            });
        }

        const { id } = req.params;
        const document = await Document.findByIdAndUpdate(id, req.body, { new: true }).populate('log');
        if (!document) {
            throw boom.notFound('Document not found');
        }
        res.status(200).json({
            message: 'Document updated successfully',
            document
        });
    } catch (err) {
        next(err);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await Document.findByIdAndDelete(id);
        if (!document) {
            throw boom.notFound('Document not found');
        }
        res.status(200).json({
            message: 'Document deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
};
