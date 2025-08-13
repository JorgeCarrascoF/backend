// routes/events.js
/*const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth');

router.post('/', authMiddleware, eventController.createEvent);
router.get('/', authMiddleware, eventController.getAllEvents);
router.get('/:id', authMiddleware, eventController.getEventById);
router.patch('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);*/


/*router.post('/', EventoController.crear);
router.get('/', EventoController.obtenerTodos);
router.get('/stats', EventoController.obtenerEstadisticas); // Antes de /:id
router.get('/project/:project_id', EventoController.obtenerPorProyecto);
router.get('/custom/:id', EventoController.obtenerPorCustomId);
router.get('/:id', EventoController.obtenerPorId);
router.get('/:id/similar', EventoController.buscarSimilares);
router.put('/:id', EventoController.actualizar);
router.patch('/:id/status', EventoController.actualizarEstado);
router.patch('/:id/increment', EventoController.incrementarContador);
router.patch('/:id/handle', EventoController.marcarComoManejado);
router.delete('/:id', EventoController.eliminar);*/

module.exports = router;