const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    // Campos existentes (mantener compatibilidad)
    sentry_event_id: {
        type: String,
        trim: true
    },
    event_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    message: {
        type: String,
        required: true,
        trim: true
    },
    link_sentry: {
        type: String,
        trim: true
    },
    culprit: {
        type: String,
        trim: true
    },
    filename:  {
        type: String,
        trim: true
    },
    function_name:  {
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
    affected_user_ip: {
        type: String,
        trim: true
    },
    sentry_timestamp: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    comments: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['unresolved', 'solved'],
        default: 'unresolved'
    },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    json_sentry: { type: Object },
    
    // NUEVOS CAMPOS para compatibilidad con SentryService
    source: {
        type: String,
        enum: ['sentry', 'sentry-transaction', 'manual', 'system'],
        default: 'manual'
    },
    level: {
        type: String,
        enum: ['fatal', 'error', 'warning', 'info', 'debug'],
        default: 'error'
    },
    category: {
        type: String,
        enum: ['database', 'authentication', 'validation', 'authorization', 'performance', 'general'],
        default: 'general'
    },
    severity: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
    },
    metadata: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Índices para mejorar performance
logSchema.index({ sentry_event_id: 1 });
logSchema.index({ source: 1 });
logSchema.index({ level: 1 });
logSchema.index({ category: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ sentry_timestamp: -1 });

// Middleware para mantener compatibilidad
logSchema.pre('save', function(next) {
    // Si no hay level, usar error_type como fallback
    if (!this.level && this.error_type) {
        this.level = this.error_type;
    }
    
    // Si no hay timestamp, usar sentry_timestamp como fallback
    if (!this.timestamp && this.sentry_timestamp) {
        this.timestamp = this.sentry_timestamp;
    }
    
    next();
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
