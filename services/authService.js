// ============================================
// services/authService.js
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const User = require('../models/user');
const { sendEmail } = require('../config/email');
const { registrationEmail } = require('../templates/registrationEmail');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

class AuthService {
    async registerUser(userData) {
        const { fullName, username, email, password, role, roleId } = userData;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [
                { username },
                { userName: username },
                { email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username || existingUser.userName === username) {
                throw boom.conflict('El nombre de usuario ya existe');
            }
            if (existingUser.email === email) {
                throw boom.conflict('El email ya está registrado');
            }
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validar y configurar el rol
        let finalRoleId = roleId;
        let finalRole = role || 'user';

        if (roleId) {
            const Role = require('../models/role');
            const roleExists = await Role.findById(roleId);
            if (!roleExists) {
                throw boom.badRequest('El rol especificado no existe');
            }
            // Mapear nombres de roles a códigos internos
            if (roleExists.name === 'Administrador') {
                finalRole = 'admin';
            } else if (roleExists.name === 'SuperAdministrador') {
                finalRole = 'superadmin';
            }
        }

        // Crear nuevo usuario
        const user = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            role: finalRole,
            roleId: finalRoleId
        });

        await user.save();
        await user.populate('roleId', 'name permission');

        // Enviar correo con los datos de registro
        try {
            const emailHtml = registrationEmail({
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                password: password
            });
            const emailSent = await sendEmail(email, '¡Bienvenido a Buggle!', emailHtml);
            if (!emailSent) {
                console.warn(`No se pudo enviar el correo de bienvenida a ${email}`);
            }
        } catch (error) {
            console.error(`Error inesperado al enviar el correo a ${email}:`, error.message);
        }


        return {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            roleInfo: user.roleId
        };
    }

    async loginUser(identifier, password) {
        // Buscar usuario por username o email
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { userName: identifier },
                { email: identifier }
            ]
        });

        if (!user) {
            throw boom.unauthorized('Credenciales inválidas');
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized('Credenciales inválidas');
        }

        // Poblar información del rol
        await user.populate('roleId', 'name permission');

        console.log('- Rol del usuario:', user.role);

        // Generar token JWT
        const token = jwt.sign({
            id: user._id,
            username: user.username || user.userName,
            email: user.email,
            role: user.role || 'user',
            roleId: user.roleId?._id
        }, JWT_SECRET, { expiresIn: '24h' });

        return {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username || user.userName,
                email: user.email,
                role: user.role || 'user',
                roleInfo: user.roleId ? {
                    id: user.roleId._id,
                    name: user.roleId.name,
                    permission: user.roleId.permission
                } : null
            }
        };
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw boom.notFound('Usuario no encontrado');
        }
        return user;
    }
}

module.exports = new AuthService();