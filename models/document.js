const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    content: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    log: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log',
        required: [true, 'El log es obligatorio']
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
