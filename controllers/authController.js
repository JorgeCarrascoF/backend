// ============================================
// controllers/authController.js (NUEVO)
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos
 */
const register = async (req, res) => {
    const { username, email, password, role, roleId } = req.body;
    
    try {
        // Verificar si el usuario ya existe (por username o email)
        const existingUser = await User.findOne({
            $or: [
                { username }, 
                { userName: username }, // Compatibilidad
                { email }
            ]
        });
        
        if (existingUser) {
            if (existingUser.username === username || existingUser.userName === username) {
                return res.status(400).json({ message: 'El nombre de usuario ya existe' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Si se proporciona roleId, verificar que el rol existe
        let finalRoleId = roleId;
        let finalRole = role || 'user';
        
        if (roleId) {
            const Role = require('../models/role');
            const roleExists = await Role.findById(roleId);
            if (!roleExists) {
                return res.status(400).json({ message: 'El rol especificado no existe' });
            }
            // Si el rol es "Administrador", establecer role como "admin"
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
        
        // Poblar el rol para la respuesta
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
        res.status(400).json({ error: err.message });
    }
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
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: "Username o email"
 *                 example: "usuario123"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales inválidas
 */
const login = async (req, res) => {
    const { login, password } = req.body;
    
    try {
        // Buscar por username, userName o email (compatibilidad)
        const user = await User.findOne({
            $or: [
                { username: login }, 
                { userName: login },
                { email: login }
            ]
        });
        
        if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

        // Poblar la información del rol
        await user.populate('roleId', 'name permission');

        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username || user.userName,
                email: user.email, 
                role: user.role || 'user',
                roleId: user.roleId?._id
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Configurar cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hora
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
        res.status(500).json({ error: err.message });
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
    res.json({ message: 'Logout exitoso' });
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
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile
};