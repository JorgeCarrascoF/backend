const Document = require('../models/document');
const boom = require('@hapi/boom');

class DocumentService {
    async createDocument(documentData) {
        const document = new Document(documentData);
        await document.save();
        return document;
    }

    async getAllDocuments() {
        return await Document.find().populate('log');
    }

    async getDocumentById(id) {
        const document = await Document.findById(id).populate('log');
        if (!document) {
            throw boom.notFound('Documento no encontrado');
        }
        return document;
    }

    async updateDocument(id, updateData) {
        const document = await Document.findByIdAndUpdate(id, updateData, { new: true }).populate('log');
        if (!document) {
            throw boom.notFound('Documento no encontrado');
        }
        return document;
    }

    async deleteDocument(id) {
        const document = await Document.findByIdAndDelete(id);
        if (!document) {
            throw boom.notFound('Documento no encontrado');
        }
        return document;
    }
}

module.exports = new DocumentService();
