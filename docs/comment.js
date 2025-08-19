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
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
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
