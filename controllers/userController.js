const User = require('../models/user'); // Asegúrate de que el nombre del archivo sea correcto

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtenido del endpoint de login
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Rol del usuario
 *         roleId:
 *           type: string
 *           description: ID del rol asignado
 *         roleInfo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             permission:
 *               type: array
 *               items:
 *                 type: string
 *         active:
 *           type: boolean
 *           description: Estado del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: "nuevo_nombre"
 *         email:
 *           type: string
 *           format: email
 *           example: "nuevo_correo@example.com"
 *         roleId:
 *           type: string
 *           example: "688abe5c6ad4e846fbdb0189"
 *         active:
 *           type: boolean
 *           example: true
 *     Error:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalle del error
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna todos los usuarios. Solo accesible para administradores.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Token no proporcionado"
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Acceso denegado. Se requiere rol de administrador."
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllUsers = async (req, res) => {
    try {
        console.log('🔍 DEBUG getAllUsers:');
        console.log('- Usuario en req:', req.user);
        console.log('- Rol del usuario:', req.user?.role);
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                msg: 'Acceso denegado. Se requiere rol de administrador.',
                userRole: req.user.role,
                required: 'admin'
            });
        }

        const users = await User.find()
            .populate('roleId', 'name permission')
            .select('-password');
            
        // Formatear la respuesta para mostrar información completa
        const formattedUsers = users.map(user => ({
            id: user._id,
            username: user.username || user.userName,
            email: user.email,
            role: user.role || 'user',
            roleInfo: user.roleId ? {
                id: user.roleId._id,
                name: user.roleId.name,
                permission: user.roleId.permission
            } : null,
            active: user.active !== undefined ? user.active : true,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json({
            success: true,
            count: formattedUsers.length,
            data: formattedUsers
        });
    } catch (err) {
        console.error('Error en getAllUsers:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al obtener usuarios', 
            error: err.message 
        });
    }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Obtiene un usuario específico. Los administradores pueden ver cualquier usuario, los usuarios normales solo pueden ver su propio perfil.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "688abe5d6ad4e846fbdb018c"
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Acceso denegado."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Usuario no encontrado."
 *       500:
 *         description: Error del servidor
 */
const getUserById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getUserById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);
        
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado.',
                detail: 'Solo los administradores pueden ver otros usuarios'
            });
        }

        const user = await User.findById(req.params.id)
            .populate('roleId', 'name permission')
            .select('-password');
            
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Formatear respuesta
        const formattedUser = {
            id: user._id,
            username: user.username || user.userName,
            email: user.email,
            role: user.role || 'user',
            roleInfo: user.roleId ? {
                id: user.roleId._id,
                name: user.roleId.name,
                permission: user.roleId.permission
            } : null,
            active: user.active !== undefined ? user.active : true,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json(formattedUser);
    } catch (err) {
        console.error('Error en getUserById:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al obtener el usuario', 
            error: err.message 
        });
    }
};

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar un usuario
 *     description: Actualiza un usuario. Los administradores pueden actualizar cualquier usuario, los usuarios normales solo pueden actualizar su propio perfil (excepto rol).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *         example: "688abe5d6ad4e846fbdb018c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Usuario actualizado."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
const updateUser = async (req, res) => {
    try {
        console.log('🔍 DEBUG updateUser:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID a actualizar:', req.params.id);
        console.log('- Datos a actualizar:', req.body);
        
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado para actualizar este usuario.',
                detail: 'Solo los administradores pueden actualizar otros usuarios'
            });
        }

        // Un usuario no-admin no puede cambiar su rol ni roleId
        if (req.user.role !== 'admin') {
            delete req.body.role;
            delete req.body.roleId;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true,
                runValidators: true,
            }
        ).populate('roleId', 'name permission').select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Formatear respuesta
        const formattedUser = {
            id: user._id,
            username: user.username || user.userName,
            email: user.email,
            role: user.role || 'user',
            roleInfo: user.roleId ? {
                id: user.roleId._id,
                name: user.roleId.name,
                permission: user.roleId.permission
            } : null,
            active: user.active !== undefined ? user.active : true,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({ 
            msg: 'Usuario actualizado exitosamente.', 
            user: formattedUser 
        });
    } catch (err) {
        console.error('Error en updateUser:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al actualizar el usuario', 
            error: err.message 
        });
    }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario. Los administradores pueden eliminar cualquier usuario, los usuarios normales solo pueden eliminar su propia cuenta.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *         example: "688abe5d6ad4e846fbdb018c"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente."
 *                 deletedUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
const deleteUser = async (req, res) => {
    try {
        console.log('🔍 DEBUG deleteUser:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID a eliminar:', req.params.id);
        
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado para eliminar este usuario.',
                detail: 'Solo los administradores pueden eliminar otros usuarios'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        res.status(200).json({ 
            msg: 'Usuario eliminado exitosamente.',
            deletedUser: {
                id: user._id,
                username: user.username || user.userName,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Error en deleteUser:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al eliminar el usuario', 
            error: err.message 
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};