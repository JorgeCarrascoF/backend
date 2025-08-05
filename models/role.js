const mongoose = require('../connections/db');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name es requerido'],
        unique: true,
        trim: true
    },
    permission: {
        type: [String],
        required: [true, 'Permission es requerido']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);