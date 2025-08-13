const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    issue_id: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    culprit: {
        type: String,
        trim: true
    },
    error_type: {
        type: String,
        trim: true,
        enum: ['error', 'warning', 'info']
    },
    environment: {
        type: String,
        enum: ['staging', 'development', 'production']
    },
    status: {
        type: String,
        enum: ['unresolved', 'solved'],
        default: 'unresolved'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
    },
    assigned_to: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    last_seen_at:
    {
        type: Date,
        default: Date.now
    },
    count: {
        type: Number
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    json_sentry: { type: Object }
    ,
},
    { timestamps: false });

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
