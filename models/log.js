const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
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
    environment: String,
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
        required: true
    },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
        
const Log = mongoose.model('Log', logSchema);
module.exports=Log;
