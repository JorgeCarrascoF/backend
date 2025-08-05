const mongoose = require('../connections/db');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username es requerido'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    userName: {  // Campo alternativo por compatibilidad
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'Password es requerido'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual para obtener el nombre de usuario correcto
userSchema.virtual('displayName').get(function () {
    return this.username || this.userName;
});

// Incluir virtuals en JSON
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);