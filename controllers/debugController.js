// // ============================================
// // controllers/debugController.js (TEMPORAL PARA DEBUG)
// // ============================================
// const User = require('../models/User');

// /**
//  * @swagger
//  * /debug/token:
//  *   get:
//  *     summary: Debug del token actual
//  *     tags: [Debug]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Info del token
//  */
// const debugToken = async (req, res) => {
//     try {
//         console.log('🔍 DEBUG Token Info:');
//         console.log('- req.user:', req.user);
        
//         res.json({
//             message: 'Token info',
//             tokenData: req.user,
//             headers: req.headers,
//             cookies: req.cookies
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * @swagger
//  * /debug/make-admin/{userId}:
//  *   put:
//  *     summary: Convertir usuario en admin (SOLO PARA DEBUG)
//  *     tags: [Debug]
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Usuario actualizado
//  */
// const makeAdmin = async (req, res) => {
//     try {
//         const { userId } = req.params;
        
//         const user = await User.findByIdAndUpdate(
//             userId, 
//             { role: 'admin' }, 
//             { new: true }
//         ).select('-password');
        
//         if (!user) {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }
        
//         res.json({
//             message: 'Usuario convertido en admin',
//             user
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// /**
//  * @swagger
//  * /debug/all-users-no-auth:
//  *   get:
//  *     summary: Ver todos los usuarios (sin autenticación - SOLO DEBUG)
//  *     tags: [Debug]
//  *     responses:
//  *       200:
//  *         description: Lista de usuarios
//  */
// const getAllUsersNoAuth = async (req, res) => {
//     try {
//         const users = await User.find().select('-password');
//         res.json({
//             message: 'Todos los usuarios (DEBUG)',
//             count: users.length,
//             users
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// module.exports = {
//     debugToken,
//     makeAdmin,
//     getAllUsersNoAuth
// };

// // ============================================
// // routes/debug.js (NUEVA RUTA TEMPORAL)
// // ============================================
// const express = require('express');
// const { debugToken, makeAdmin, getAllUsersNoAuth } = require('./debugController');
// const auth = require('../middleware/auth');

// const router = express.Router();

// router.get('/token', auth, debugToken);
// router.put('/make-admin/:userId', makeAdmin);
// router.get('/all-users-no-auth', getAllUsersNoAuth);

// module.exports = router;

// // ============================================
// // ACTUALIZAR app.js - AGREGAR RUTA DEBUG
// // ============================================
// /*
// Agregar esta línea en app.js después de las otras rutas:

// const debugRouter = require('./routes/debug');
// app.use('/api/debug', debugRouter);
// */