// controllers/userController.js
const userService = require('../services/userServices');
const { updateUserSchema } = require('../validations/userSchema');

// Las definiciones de Swagger no cambian, por lo que se omiten por brevedad...

const getUsersByFilter = async (req, res) => {
    try {
        // 1. Verificación de permisos (responsabilidad del controlador)
        if (!['admin', 'user'].includes(req.user.role)) {
            return res.status(403).json({
                msg: 'Acceso denegado. Rol no autorizado.',
            });
        }
        
        // 2. Preparar datos para el servicio
        const filters = {
            username: req.query.username,
            email: req.query.email,
            role: req.query.role,
            isActive: req.query.isActive,
            search: req.query.search,
        };
        const pagination = {
            limit: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
        };

        // 3. Llamar al servicio
        const { data, count } = await userService.getUsersByFilter(filters, pagination);

        // 4. Enviar respuesta HTTP
        res.status(200).json({
            success: true,
            page: pagination.page,
            limit: pagination.limit,
            count: data.length, // Registros en la página actual
            total: count, // Total de registros que coinciden con el filtro
            data: data,
        });

    } catch (err) {
        console.error('Error en controller getUsersByFilter:', err);
        res.status(500).json({ msg: 'Error del servidor al filtrar usuarios', error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        // 1. Verificación de permisos
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado.' });
        }

        // 2. Llamar al servicio
        const user = await userService.getUserById(req.params.id);
        
        // 3. Enviar respuesta HTTP
        res.status(200).json(user);

    } catch (err) {
        console.error('Error en controller getUserById:', err);
        if (err.message === 'Usuario no encontrado.') {
            return res.status(404).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Error del servidor al obtener el usuario', error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // 1. Verificación de permisos y validación de entrada
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ msg: 'Acceso denegado para actualizar este usuario.' });
        }

        const { error } = updateUserSchema.validate(updateData, { abortEarly: false });
        if (error) {
            return res.status(400).json({ msg: 'Error de validación', details: error.details.map(d => d.message) });
        }

        // Un no-admin no puede cambiar su rol
        if (req.user.role !== 'admin') {
            delete updateData.role;
            delete updateData.roleId;
        }

        // 2. Llamar al servicio
        const updatedUser = await userService.updateUser(id, updateData);

        // 3. Enviar respuesta HTTP
        res.status(200).json({
            msg: 'Usuario actualizado exitosamente.',
            user: updatedUser,
        });

    } catch (err) {
        console.error('Error en controller updateUser:', err);
        if (err.message === 'Usuario no encontrado.') {
            return res.status(404).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Error del servidor al actualizar el usuario', error: err.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        // 1. Verificación de permisos
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para eliminar este usuario.' });
        }

        // 2. Llamar al servicio
        const deletedUser = await userService.deleteUser(req.params.id);

        // 3. Enviar respuesta HTTP
        res.status(200).json({
            msg: 'Usuario eliminado exitosamente.',
            deletedUser: deletedUser
        });

    } catch (err) {
        console.error('Error en controller deleteUser:', err);
        if (err.message === 'Usuario no encontrado.') {
            return res.status(404).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Error del servidor al eliminar el usuario', error: err.message });
    }
};

module.exports = {
    getUsersByFilter,
    getUserById,
    updateUser,
    deleteUser,
};