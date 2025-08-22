const express = require('express');
const router = express.Router();
const statusRegisterController = require('../controllers/statusRegisterController');
const {authMiddleware} = require('../middleware/auth'); 
//const authorizeAdmin = require('../middleware/authorizeAdmin'); 

// Aplicar los middlewares a todas las rutas de comments
router.post('/', authMiddleware, statusRegisterController.createStatusRegister);

module.exports = router;
