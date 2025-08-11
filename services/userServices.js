// services/userService.js
const Boom = require('@hapi/boom');
const User = require('../models/user');
const { updateUserSchema } = require('../validations/userSchema');

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

const getUserById = async (userId) => {
    const user = await User.findById(userId)
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw new Error('Usuario no encontrado.');
    }

    return _formatUserData(user);
};


const updateUser = async (userId, updateData) => {
    // Validar con Joi
    const { error } = updateUserSchema.validate(updateData);
    if (error) {
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.details = error.details.map((d) => ({
            message: d.message,
            path: d.path.join('.'),
            type: d.type,
        }));
        throw validationError;
    }

    // Verificar email duplicado
    if (updateData.email) {
        const emailExists = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
        if (emailExists) {
            const conflictError = new Error('El email ya está en uso por otro usuario.');
            conflictError.statusCode = 409; // Conflict
            throw conflictError;
        }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    })
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        const notFoundError = new Error('Usuario no encontrado.');
        notFoundError.statusCode = 404;
        throw notFoundError;
    }

    return _formatUserData(user);
};


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
