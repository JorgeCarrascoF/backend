const express = require('express');
const { saludar, getCompletion } = require('../controllers/suggestionController');

const router = express.Router();

router.post('/', saludar);
router.post('/completion', getCompletion)

module.exports = router;