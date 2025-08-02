// ============================================
// routes/auth.js (CORREGIDO)
// ============================================
const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getProfile);

module.exports = router;