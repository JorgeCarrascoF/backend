const express = require('express');
const middleware = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', middleware, (req, res) => {
  res.json({ msg: `Bienvenido ${req.user.userName}` });
});

module.exports = router;
