// ============================================
// routes/users.js (ACTUALIZADO)
// ============================================
const express = require('express');
const { 
    getAllUsers, 
    getUserById, 
    updateUser,     // Importar nueva función
    deleteUser,      // Importar nueva función
    getUsersByFilter
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Rutas GET
router.get('/', auth, getUsersByFilter);
router.get('/:id', auth, getUserById);

// Nueva ruta PATCH para actualizar
router.patch('/:id', auth, updateUser);

// Nueva ruta DELETE para eliminar
router.delete('/:id', auth, deleteUser);

module.exports = router;