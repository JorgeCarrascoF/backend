// ============================================
// controllers/authController.js
// ============================================
const boom = require('@hapi/boom');
const authService = require('../services/authService');
const { registerSchema } = require('../validations/authSchema');

const register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Extraer los mensajes de error personalizados
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: errorMessages.join(', ')
            });
        }

        const { fullName, username, email, password, role, roleId } = req.body;

        const user = await authService.registerUser({
            fullName,
            username,
            email,
            password,
            role,
            roleId
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email: identifier, password } = req.body;

    try {
        const { token, user } = await authService.loginUser(identifier, password);

        // Configurar cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.json({
            message: 'Login exitoso',
            token,
            user
        });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout exitoso' });
};

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile
};