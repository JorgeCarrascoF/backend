// ============================================
// controllers/authController.js (CORREGIDO)
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const User = require('../models/user');
const { registerSchema } = require('../validations/authSchema');


const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "usuario123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum: [admin, user, dev, qa]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     roleInfo:
 *                       type: object
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "El campo 'email' es obligatorio, La contraseña debe incluir mayúsculas, minúsculas, números y símbolos"
 *       409:
 *         description: Conflicto, por ejemplo, usuario o email ya existen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "El nombre de usuario ya existe, El email ya está registrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "Error del servidor al registrar el usuario"
 */

const register = async (req, res) => {
    try {
        // Validar los datos de entrada
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Mapear los errores de validación a un formato más legible
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: errorMessages.join(', ')
            });
        }

        const { username, email, password, role, roleId } = value;

        const existingUser = await User.findOne({
            $or: [
                { username },
                { userName: username },
                { email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username || existingUser.userName === username) {
                return res.status(409).json({
                    statusCode: 409,
                    error: "Conflict",
                    message: "El nombre de usuario ya existe"
                });
            }
            if (existingUser.email === email) {
                return res.status(409).json({
                    statusCode: 409,
                    error: "Conflict",
                    message: "El email ya está registrado"
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let finalRoleId = roleId;
        let finalRole = role || 'user';

        if (roleId) {
            const Role = require('../models/role');
            const roleExists = await Role.findById(roleId);
            if (!roleExists) {
                return res.status(400).json({
                    statusCode: 400,
                    error: "Bad Request",
                    message: "El rol especificado no existe"
                });
            }
            if (roleExists.name === 'Administrador') {
                finalRole = 'admin';
            }
        }

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: finalRole,
            roleId: finalRoleId
        });

        await user.save();
        await user.populate('roleId', 'name permission');

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                roleInfo: user.roleId
            }
        });
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Error del servidor al registrar el usuario"
        });
    }
};

module.exports = {
    register
};

module.exports = {
    register
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Puede ser username o email (el campo acepta ambos)"
 *                 example: "usuario123"
 *                 x-examples:
 *                   - "usuario123"
 *                   - "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   description: "JWT token"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     roleInfo:
 *                       type: object
 *       401:
 *         description: Credenciales inválidas
 */
const login = async (req, res, next) => {
    // Mantener el nombre 'email' pero aceptar username o email
    const { email: identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { userName: identifier },
                { email: identifier }
            ]
        });

        if (!user) return next(boom.unauthorized('Credenciales inválidas'));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(boom.unauthorized('Credenciales inválidas'));

        await user.populate('roleId', 'name permission');

        console.log('- Rol del usuario:', user.role);

        const token = jwt.sign({
            id: user._id,
            username: user.username || user.userName,
            email: user.email,
            role: user.role || 'user',
            roleId: user.roleId?._id
        }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username || user.userName,
                email: user.email,
                role: user.role || 'user',
                roleInfo: user.roleId ? {
                    id: user.roleId._id,
                    name: user.roleId.name,
                    permission: user.roleId.permission
                } : null
            }
        });
    } catch (err) {
        next(boom.internal(err.message));
    }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
const logout = (req, res) => {
    res.clearCookie('token');
    //console.log('- Rol del usuario:', user.role);
    //res.json({ message: 'Logout exitoso' });
    res.status(200).json({ message: 'Logout exitoso' });
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return next(boom.notFound('Usuario no encontrado'));
        res.json(user);
    } catch (err) {
        next(boom.internal('Error del servidor'));
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile
};