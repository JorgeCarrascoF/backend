// ============================================
// routes/roles.js (CORREGIDO)
// ============================================
const express = require('express');
const { createRole, getAllRoles } = require('../controllers/roleController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createRole);
router.get('/', getAllRoles);

module.exports = router;