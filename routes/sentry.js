// ============================================
// routes/sentry.js
// Rutas para el controlador de Sentry
// ============================================
const express = require('express');
const { 
    getSentryStats,
    getSentryEventsByCategory,
    getSentryEventsByLevel,
    getSentrySummary,
    getSentryEventById
} = require('../controllers/sentryController');
const { authMiddleware, requireAdminOrSuper } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para estadísticas (admin y superadmin)
router.get('/stats', requireAdminOrSuper, getSentryStats);
router.get('/summary', requireAdminOrSuper, getSentrySummary);

// Rutas para eventos (admin y superadmin)
router.get('/events/category', requireAdminOrSuper, getSentryEventsByCategory);
router.get('/events/level', requireAdminOrSuper, getSentryEventsByLevel);
router.get('/events/:id', requireAdminOrSuper, getSentryEventById);

module.exports = router;

