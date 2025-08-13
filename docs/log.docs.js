/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - message
 *         - event_id
 *         - sentry_timestamp
 *         - created_at
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del log
 *         sentry_event_id:
 *           type: string
 *           description: ID del evento en Sentry
 *         event_id:
 *           type: string
 *           description: ID del evento interno
 *         message:
 *           type: string
 *           description: Mensaje del error o log
 *         link_sentry:
 *           type: string
 *           description: Enlace al error en Sentry
 *         culprit:
 *           type: string
 *           description: Causa principal del error
 *         filename:
 *           type: string
 *           description: Nombre del archivo donde ocurrió el error
 *         function_name:
 *           type: string
 *           description: Función donde ocurrió el error
 *         error_type:
 *           type: string
 *           enum: ['error', 'warning', 'info']
 *           description: Tipo de error
 *         environment:
 *           type: string
 *           enum: ['staging', 'development', 'production']
 *           description: Entorno de ejecución
 *         affected_user_ip:
 *           type: string
 *           description: IP del usuario afectado
 *         sentry_timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora original del evento en Sentry
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se registró el log en el sistema
 *         comments:
 *           type: string
 *           description: Comentarios de los usuarios
 *         status:
 *           type: string
 *           enum: ['unresolved', 'solved']
 *           description: Estado del log
 *         userId:
 *           type: string
 *           description: ID del usuario que generó el log
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Obtener todos los Logs (con filtros, paginación y ordenamiento)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de logs por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por múltiples campos
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: sentry_timestamp
 *         description: Campo por el cual ordenar (ej. sentry_timestamp, created_at)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de clasificación (ascendente o descendente)
 *       - in: query
 *         name: link_sentry
 *         schema:
 *           type: string
 *         description: Enlace al error en Sentry
 *       - in: query
 *         name: culprit
 *         schema:
 *           type: string
 *         description: Causa principal del error
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         description: Nombre del archivo donde ocurrió el error
 *       - in: query
 *         name: function_name
 *         schema:
 *           type: string
 *         description: Función donde ocurrió el error
 *       - in: query
 *         name: error_type
 *         schema:
 *           type: string
 *           enum: ['error', 'warning', 'info']
 *         description: Tipo de error
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: ['staging', 'development', 'production']
 *         description: Entorno de ejecución
 *       - in: query
 *         name: comments
 *         schema:
 *           type: string
 *         description: Comentarios de los usuarios
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['unresolved', 'solved']
 *         description: Estado del log
 *     responses:
 *       200:
 *         description: Lista de Logs obtenida correctamente
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
 *                   description: Número de logs en la página actual
 *                   example: 5
 *                 total:
 *                   type: integer
 *                   description: Número total de logs que coinciden con la consulta
 *                   example: 55
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Obtener un Log por ID
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       404:
 *         description: Log no encontrado
 */

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Crear un nuevo log
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Log'
 *     responses:
 *       201:
 *         description: Log creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /logs/{id}:
 *   patch:
 *     summary: Actualizar un log existente
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Log'
 *     responses:
 *       200:
 *         description: Log actualizado
 *       404:
 *         description: Log no encontrado
 */

/**
 * @swagger
 * /logs/{id}:
 *   delete:
 *     summary: Eliminar un log
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log eliminado
 *       404:
 *         description: Log no encontrado
 */
