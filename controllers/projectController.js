/*const projectService = require('../services/projectService');

const rolAdmin = 'admin';

const getAllProjects = async (req, res) => {
    try {
        console.log('🔍 DEBUG getAllProjects:');
        console.log('- Usuario en req:', req.user);
        console.log('- Rol del usuario:', req.user?.role);
        const roles = ['admin', 'user'];
         if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: 'Acceso denegado. Se requiere rol de administrador, desarrollador o QA.',
                userRole: req.user.role,
                required: roles
            });
        }

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        //const totalProjects = await Project.countDocuments(searchQuery);
        const projects = await projectService.getAllProjects(req.query, { limit, skip });

        res.status(200).json({
            success: true,
            page,
            limit,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener los proyectos', error: err.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getProjectyId:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);

        const roles = ['admin', 'user'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado.',
                detail: 'Solo los adminstradores, desarrolladores y QA pueden ver los proyectos por ID'
            });
        }

        const project = await projectService.getProjectById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener el Proyecto', error: err.message });
    }
};

const createProject = async (req, res) => {
    try {
        if (!rolAdmin.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acceso denegado para crear proyectos.' });
        }

        const newProject = await projectService.createProject(req.body);

        res.status(201).json({ msg: 'Proyecto creado exitosamente', project: newProject });
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear el Proyecto', error: err.message });
    }
};

const updateProject = async (req, res) => {
    try {
        console.log('🔍 DEBUG updateProject:');
        console.log('- Project solicitante:', req.Project);
        console.log('- ID a actualizar:', req.params.id);
        console.log('- Datos a actualizar:', req.body);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para actualizar este proyecto.' });
        }

        const project = await projectService.updateProject(req.params.id, req.body);

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }

        res.status(200).json({ msg: 'Proyecto actualizado exitosamente.', project });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al actualizar el Proyecto', error: err.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        console.log('🔍 DEBUG deleteProject:');
        console.log('- Project solicitante:', req.Project);
        console.log('- ID a eliminar:', req.params.id);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para eliminar este Proyecto.' });
        }

        const project = await projectService.deleteProject(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }

        res.status(200).json({ msg: 'Proyecto eliminado exitosamente.', deletedProject: { id: project._id } });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al eliminar el Proyecto', error: err.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};*/
