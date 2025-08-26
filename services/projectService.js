/*const Project = require('../models/project');

const getAllProjects = async (filters, pagination) => {
    const { limit, skip } = pagination;
    const query = {};

    if (filters.search) {
        query.$or = [
            { sentry_project_id: { $regex: filters.search, $options: 'i' } },
            { name: { $regex: filters.search, $options: 'i' } },
            { slug: { $regex: filters.search, $options: 'i' } },
            { platform: { $regex: filters.search, $options: 'i' } },
        ];
    }

    ['sentry_project_id', 'name', 'slug', 'platform']
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
        sentry_project_id: project.sentry_project_id,
        name: project.name,
        slug: project.slug,
        platform: project.platform,
        is_active: project.is_active,
        created_at: project.created_at
    }));
};

const getProjectById = async (id) => {
    const project = await Project.findById(id)
        //.populate('userId', 'username email')
        .select('-password');

    if (!project) return null;

    return {
        id: project._id,
        sentry_project_id: project.sentry_project_id,
        name: project.name,
        slug: project.slug,
        platform: project.platform,
        is_active: project.is_active,
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
        sentry_project_id: project.sentry_project_id,
        name: project.name,
        slug: project.slug,
        platform: project.platform,
        is_active: project.is_active,
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
*/