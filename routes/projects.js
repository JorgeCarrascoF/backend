// routes/projects.js
const express = require('express');
const projectController = require('../controllers/projectController');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth');

router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;