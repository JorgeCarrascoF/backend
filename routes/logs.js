// ============================================
// routes/users.js (ACTUALIZADO)
// ============================================
const express = require('express');
const { 
    getAllLogs, 
    getLogById, 
    updateLog,
    deleteLog,
    createLog,
} = require('../controllers/logController');
const auth = require('../middleware/auth');

const router = express.Router();

//Ruta para creación
router.post('/', auth, createLog);

// Rutas GET
router.get('/', auth, getAllLogs);
router.get('/:id', auth, getLogById);

// Nueva ruta PATCH para actualizar
router.patch('/:id', auth, updateLog);

// Nueva ruta DELETE para eliminar
router.delete('/:id', auth, deleteLog);

module.exports = router;