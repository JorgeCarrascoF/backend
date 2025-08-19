/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *           description: "Nombre completo del usuario"
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: ['superadmin', 'admin', 'user']
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
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserUpdate:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     Error:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener usuarios filtrados con paginación
 *     description: >
 *       Retorna usuarios según filtros avanzados (username, email, role, estado), con paginación.  
 *       Solo accesible para roles distintos de `user` (superadmin y admin).
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por múltiples campos
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de usuario exacto
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Filtrar por correo exacto
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ['superadmin', 'admin', 'user']
 *         description: Filtrar por rol exacto
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de actividad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página a solicitar (paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Userlist obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unprovided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Access denied – only admin or user roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unprovided or invalid token
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Access denied."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "User not found."
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar un usuario
 *     description: >
 *       Actualiza un usuario.  
 *       - Los administradores pueden actualizar cualquier usuario (incluyendo rol).  
 *       - Los usuarios normales solo pueden actualizar su propio perfil, **excluyendo** los campos `role` y `email`.  
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User updated successfully."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (e.g., invalid email format)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "The email is not valid."
 *       401:
 *         description: Unprovided or invalid token
 *       403:
 *         description: Access denied (only admin or user owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Access denied to update this user."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "User not found."
 *       409:
 *         description: Email already in use by another user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Email already in use by another user."
 *       500:
 *         description: Server error
 */

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User deleted successfully."
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
 *         description: Unprovided or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Cambiar la contraseña del usuario actual
 *     description: >
 *       Permite al usuario autenticado cambiar su contraseña.
 *       Se requiere proporcionar la contraseña actual y la nueva contraseña.
 *       La nueva contraseña debe cumplir con los requisitos de seguridad.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: "Contraseña actual del usuario"
 *               newPassword:
 *                 type: string
 *                 description: "Nueva contraseña del usuario"
 *             required:
 *               - currentPassword
 *               - newPassword
 *           example:
 *             currentPassword: "contraseña_antigua"
 *             newPassword: "nueva_contraseña_segura"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Password changed successfully."
 *       400:
 *         description: Validation error or incorrect data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               currentPasswordIncorrect:
 *                 value:
 *                   msg: "Current password is incorrect."
 *               newPasswordInvalid:
 *                 value:
 *                   msg: "New password must be at least 6 characters long."
 *       401:
 *         description: Unprovided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
