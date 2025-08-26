/*const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    sentry_project_id: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        trim: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
});
        
const Project = mongoose.model('Project', projectSchema);
module.exports=Project;
*/