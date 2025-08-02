const User = require('../models/user');

/**
 * @swagger
 * /users:
 * get:
 * summary: Obtener todos los usuarios (solo para administradores)
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Una lista de todos los usuarios.
 * 403:
 * description: Acceso denegado.
 */
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
        }
        const users = await User.find().populate('roleId', 'name permission').select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener usuarios', error: err.message });
    }
};

/**
 /**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna todos los usuarios (solo para administradores).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *       403:
 *         description: Acceso denegado.
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos correctamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
 *
 *   patch:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nuevo_nombre"
 *               email:
 *                 type: string
 *                 example: "nuevo_correo@example.com"
 *               roleId:
 *                 type: string
 *                 example: "688abe5c6ad4e846fbdb0189"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
 *
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
*/

const getUserById = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado.' });
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado.' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener el usuario', error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para actualizar este usuario.' });
        }

        // Un usuario no-admin no puede cambiar su rol.
        if (req.user.role !== 'admin') {
            delete req.body.role;
            delete req.body.roleId;
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado.' });

        res.status(200).json({ msg: 'Usuario actualizado.', user });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al actualizar el usuario', error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para eliminar este usuario.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado.' });

        res.status(200).json({ msg: 'Usuario eliminado exitosamente.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al eliminar el usuario', error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};