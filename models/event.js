const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    issue_id: {
        type: String,
        trim: true,
        required: true
    },
    short_id: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        trim: true
    },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    status:  {
        type: String,
        trim: true
    },
    count:  {
        type: Number
    },
    user_count: {
        type: Number,
    },
    is_unhandled: {
        type: Boolean
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    update_at: {
        type: Date
    },
});
        
const Event = mongoose.model('Event', eventSchema);
module.exports=Event;
