const logService = require('../services/logService');

const rolAdmin = ['superadmin', 'admin'];

const getAllLogs = async (req, res) => {
    try {
        console.log('🔍 DEBUG getAllLogs:');
        console.log('- Usuario en req:', req.user);
        console.log('- Rol del usuario:', req.user?.role);

        const roles = ['superadmin', 'admin', 'user'];
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
        const sortBy = req.query.sortBy || 'last_seen_at';
        const sortOrder = req.query.sortOrder || 'desc';

        const result = await logService.getAllLogs(req.query, { limit, skip, sortBy, sortOrder });

        res.status(200).json({
            success: true,
            page,
            limit,
            count: result.data.length,
            total: result.total,
            data: result.data
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener Logs', error: err.message });
    }
};


const getLogById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getLogById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);

        const roles = ['superadmin', 'admin', 'user'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({
                msg: 'Acceso denegado.',
                detail: 'Solo los adminstradores, desarrolladores y QA pueden ver los logs por ID'
            });
        }

        const log = await logService.getLogById(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        res.status(200).json(log);
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener el Log', error: err.message });
    }
};

const createLog = async (req, res) => {
    try {
        if (!rolAdmin.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acceso denegado para crear logs.' });
        }

        const newLog = await logService.createLog(req.body);

        if (newLog.update){
            return res.status(200).json({
                msg: 'Log updated - duplicated found',
                log: newLog
            });
        }

        res.status(201).json({ msg: 'Log created successfully', log: newLog });
    } catch (err) {
        res.status(500).json({ msg: 'Error creating log' , error: err.message });
    }
};

const updateLog = async (req, res) => {
    try {
        console.log('🔍 DEBUG updateLog:');
        console.log('- Log solicitante:', req.Log);
        console.log('- ID a actualizar:', req.params.id);
        console.log('- Datos a actualizar:', req.body);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para actualizar este log.' });
        }

        const log = await logService.updateLog(req.params.id, req.body);

        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        res.status(200).json({ msg: 'Log actualizado exitosamente.', log });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al actualizar el Log', error: err.message });
    }
};

const deleteLog = async (req, res) => {
    try {
        console.log('🔍 DEBUG deleteLog:');
        console.log('- Log solicitante:', req.Log);
        console.log('- ID a eliminar:', req.params.id);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para eliminar este log.' });
        }

        const log = await logService.deleteLog(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        res.status(200).json({ msg: 'Log eliminado exitosamente.', deletedLog: { id: log._id } });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al eliminar el Log', error: err.message });
    }
};

module.exports = {
    getAllLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog
};
