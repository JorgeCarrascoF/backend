// ============================================
// routes/auth.js (CORREGIDO)
// ============================================
const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authSchema');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', getProfile);

module.exports = router;
