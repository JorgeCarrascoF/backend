/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints para gestión de comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del comentario
 *         text:
 *           type: string
 *           description: Texto del comentario
 *         pinned:
 *           type: boolean
 *           description: Indica si el comentario está fijado
 *           example: false
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del comentario
 *         user:
 *           type: object
 *           description: Usuario asociado al comentario
 *           properties:
 *             id:
 *               type: string
 *               description: ID del usuario
 *             fullName:
 *               type: string
 *               description: Nombre completo del usuario
 *         log:
 *           type: object
 *           description: Log asociado al comentario
 *           properties:
 *             id:
 *               type: string
 *               description: ID del log
 *             message:
 *               type: string
 *               description: Mensaje del log
 *     CommentInput:
 *       type: object
 *       required:
 *         - text
 *         - logId
 *       properties:
 *         text:
 *           type: string
 *           description: Texto del comentario
 *           example: "Texto del Comentario"
 *         pinned:
 *           type: boolean
 *           description: Indica si el comentario está fijado
 *           example: false
 *         logId:
 *           type: string
 *           description: ID del log asociado
 *           example: "60d5ec9f8c3da2b348d27e4a"
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comments creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Error en los datos de entrada
*/


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Obtener todos los comentarios (con filtros y paginación)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/log/{logId}:
 *   get:
 *     summary: Obtener comentarios de un log específico (con filtros y paginación)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del log asociado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número de comentarios por página
 *     responses:
 *       200:
 *         description: Lista de comentarios del log solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                   description: Número de comentarios devueltos en esta página
 *                 total:
 *                   type: integer
 *                   description: Total de comentarios para este log
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: No se encontraron comentarios para este log
 *       500:
 *         description: Error en el servidor
 */


/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *   patch:
 *     summary: Actualizar un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *       404:
 *         description: Comentario no encontrado
 */
