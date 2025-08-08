// services/userService.js
const Boom = require('@hapi/boom');
const User = require('../models/user');
const { updateUserSchema } = require('../validations/userSchema');
const mongoose = require('mongoose');

/**
 * Formatea los datos de un usuario para la respuesta de la API.
 * @param {object} user - El objeto de usuario de Mongoose.
 * @returns {object} - El objeto de usuario formateado.
 */
const _formatUserData = (user) => {
    if (!user) return null;
    return {
        id: user._id,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || 'user',
        roleInfo: user.roleId ? {
            id: user.roleId._id,
            name: user.roleId.name,
            permission: user.roleId.permission
        } : null,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

/**
 * Obtiene usuarios filtrados y paginados desde la base de datos.
 * @param {object} filters - Objeto con los filtros a aplicar (username, email, etc.).
 * @param {object} pagination - Objeto con { page, limit }.
 * @returns {Promise<object>} - Un objeto con la lista de usuarios y la cuenta total.
 */
const getUsersByFilter = async (filters, pagination) => {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const { search, username, email, role, isActive } = filters;

    const query = {};
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
        ];
    }


    if (username) query.username = username;
    if (email) query.email = email;
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const users = await User.find(query)
        .populate('roleId', 'name permission')
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

    const totalUsers = await User.countDocuments(query);

    const formattedUsers = users.map(_formatUserData);

    return { data: formattedUsers, count: totalUsers };
};

/**
 * Obtiene un único usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<object>} - El usuario formateado.
 * @throws {Error} - Si el usuario no se encuentra.
 */
const getUserById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw Boom.badRequest('El ID proporcionado no es válido.');
    }

    const user = await User.findById(userId)
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw Boom.notFound('Usuario no encontrado.');
    }

    return _formatUserData(user);
};

/**
 * Actualiza un usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @param {object} updateData - Los datos para actualizar.
 * @returns {Promise<object>} - El usuario actualizado y formateado.
 * @throws {Error} - Si el usuario no se encuentra o si el email ya existe.
 */
const updateUser = async (userId, updateData) => {
    // No permitir actualizar email
    if ('email' in updateData) {
        throw Boom.conflict('El campo email no puede actualizarse');
    }

    // Validar con Joi
    const { error } = updateUserSchema.validate(updateData);
    if (error) {
        throw Boom.badRequest('Error de validación', {
            details: error.details.map((d) => ({
                message: d.message,
                path: d.path.join('.'),
                type: d.type,
            })),
        });
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    })
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw Boom.notFound('Usuario no encontrado.');
    }

    return _formatUserData(user);
};

/**
 * Realiza una eliminación lógica de un usuario por su ID (lo marca como inactivo).
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<object>} - El usuario "eliminado" y formateado.
 * @throws {Error} - Si el usuario no se encuentra.
 */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new Error('Usuario no encontrado.');
    }

    return _formatUserData(user);
};

module.exports = {
    getUsersByFilter,
    getUserById,
    updateUser,
    deleteUser,
};
