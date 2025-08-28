const Project = require('../models/project');

const getAllProjects = async (filters, pagination) => {
    const { limit, skip } = pagination;
    const query = {};

    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
        ];
    }

    ['name']
        .forEach(field => {
            if (filters[field]) query[field] = filters[field];
        });

    const projects = await Project.find(query)
        //.populate('userId', 'username email')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

    return projects.map(project => ({
        id: project._id,
        name: project.name,
        repo: project.repo,
        branch: project.branch,
        github_token: project.github_token,
        created_at: project.created_at
    }));
};

const getProjectById = async (id) => {
    const project = await Project.findById(id)
        

    if (!project) return null;

    return {
        id: project._id,
        name: project.name,
        repo: project.repo,
        branch: project.branch,
        github_token: project.github_token,
        created_at: project.created_at
    };
};

const createProject = async (data) => {
    const newProject = new Project(data);
    return await newProject.save();
};

const updateProject = async (id, data) => {
    const project = await Project.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })//.populate('userId', 'username email').select('-password');

    if (!project) return null;

    return {
        id: project._id,
        name: project.name,
        repo: project.repo,
        branch: project.branch,
        github_token: project.github_token,
        created_at: project.created_at
    };
};

const deleteProject = async (id) => {
    return await Project.findByIdAndDelete(id);
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};