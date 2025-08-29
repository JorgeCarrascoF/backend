const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    
    name: {
        type: String,
        trim: true,
        required: true
    },

    repo: {
        type: String,
        require: true
    },

    branch: {
        type: String,
        default: 'main'
    },

    github_token: {
        type: String,
        require: true
    },
    
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
});
        
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
