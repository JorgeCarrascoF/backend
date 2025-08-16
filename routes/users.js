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
const { authMiddleware, requireSuperAdmin, requireAdminOrSuper } = require('../middleware/auth');
const { userPermissions } = require('../middleware/permissions');

const router = express.Router();

// Rutas GET
router.get('/', authMiddleware, userPermissions.canRead, getUsersByFilter);
router.get('/:id', authMiddleware, userPermissions.canRead, getUserById);

// Nueva ruta PATCH para actualizar
router.patch('/:id', authMiddleware, userPermissions.canUpdate, updateUser);

// Nueva ruta DELETE para eliminar - solo superadmin
router.delete('/:id', authMiddleware, requireSuperAdmin, deleteUser);

module.exports = router;