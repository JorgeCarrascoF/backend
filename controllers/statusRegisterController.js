const statusRegisterService = require('../services/statusRegisterService');

const roles = ['user', 'superadmin', 'admin'];

const getStatusRegisterById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getStatusRegisterById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);

        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({
                msg: 'Access denied.',
                detail: 'Only superadmin, administrators, and users can view status Register by ID'
            });
        }

        const statusRegister = await statusRegisterService.getStatusRegisterById(req.params.id);

        if (!statusRegister) {
            return res.status(404).json({ msg: 'Status Register not found.' });
        }

        res.status(200).json(statusRegister);
    } catch (err) {
        res.status(500).json({ msg: 'Error obtaining Status Register', error: err.message });
    }
};

const createStatusRegister = async (req, res) => {
    try {
        const { logId, status } = req.body;
        const userId = req.user.id;

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied.' });
        }

        const result = await statusRegisterService.createStatusRegister({
            logId,
            userId,
            status,
        });

        res.status(200).json({
            msg: 'Log status updated and change registered successfully.',
            log: result.log,
            statusRegister: result.statusRegister,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error registering status change', error: err.message });
    }
};


module.exports = {
    createStatusRegister
};
