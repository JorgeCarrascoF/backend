// ============================================
// routes/auth.js (CORREGIDO)
// ============================================
const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, recoverPassword } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, recoverPasswordSchema } = require('../validations/authSchema');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', getProfile);
router.post('/recover-password', validate(recoverPasswordSchema), recoverPassword);

module.exports = router;
