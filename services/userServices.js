// services/userService.js
const Boom = require('@hapi/boom');
const User = require('../models/user');
const { updateUserSchema } = require('../validations/userSchema');
const mongoose = require('mongoose');
// Opcional: para capturar errores en Sentry antes de forzar crash
// const Sentry = require('../instrument');

const _formatUserData = (user) => {
    if (!user) return null;
    return {
        id: user._id,
        fullName: user.fullName,
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


/* -------------------------
   VERSIÓN ORIGINAL (correcta)
   (Se deja comentada para referencia)
------------------------- */

const updateUser = async (userId, updateData) => {
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

    // Verificar email duplicado
    if (updateData.email) {
        const emailExists = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
        if (emailExists) {
            throw Boom.conflict('El email ya está en uso por otro usuario.');
        }
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


// /* -------------------------
//    VERSIÓN QUE FORZA ERROR / TUMBA EL SERVIDOR 
//    NOTA: Esto forzará un crash asíncrono del proceso.
//    usarlo solo en desarrollo para probar el sdk de sentry SOLO en desarrollo. Para desactivar, reemplaza por la versión original arriba.
// ------------------------- */
// const updateUser = async (userId, updateData) => {
//     // --- Validación previa (igual que la versión correcta) ---
//     const { error } = updateUserSchema.validate(updateData);
//     if (error) {
//         const validationError = new Error('Error de validación');
//         validationError.statusCode = 400;
//         validationError.details = error.details.map((d) => ({
//             message: d.message,
//             path: d.path.join('.'),
//             type: d.type,
//         }));
//         throw validationError;
//     }

//     // --- Forzar un crash asíncrono: esto no será atrapado por try/catch de controladores ---
//     // Método 1: lanzar en nextTick -> uncaughtException -> crash
//     process.nextTick(() => {
//         throw new Error('Crash forzado desde updateUser (process.nextTick).');
//     });

//     // Alternativa (comentada): exit inmediato del proceso
//     // setTimeout(() => process.exit(1), 100);

//     // Por si acaso devuelvo algo (esto raramente llegará antes del crash)
//     return {
//         id: userId,
//         username: updateData.username || 'test',
//         note: 'Este return puede no llegar porque el proceso será crasheado asíncronamente'
//     };
// };

/* -------------------------
   deleteUser (sin cambios)
------------------------- */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    ).select('-password');

    if (!user) {
        throw Boom.notFound('Usuario no encontrado.');
    }

    return _formatUserData(user);
};

// Función para comparar contraseñas
const comparePassword = async (candidatePassword, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw Boom.notFound('Usuario no encontrado.');
    }
    return await user.comparePassword(candidatePassword);
};

// Función para actualizar la contraseña
const updatePassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw Boom.notFound('Usuario no encontrado.');
    }

    user.password = newPassword;
    await user.save();

    return _formatUserData(user);
};

module.exports = {
    getUsersByFilter,
    getUserById,
    updateUser,
    deleteUser,
    comparePassword,
    updatePassword,
};
