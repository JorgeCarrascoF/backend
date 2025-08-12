// routes/projects.js
const express = require('express');
const projectController = require('../controllers/projectController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getAllProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.patch('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;