/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - issue_id
 *         - message
 *         - created_at
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del log
 *         issue_id:
 *           type: string
 *           description: ID único del incidente (coincide con Sentry si aplica)
 *         message:
 *           type: string
 *           description: Mensaje del error
 *         description:
 *           type: string
 *           description: Descripción detallada, útil para logs manuales
 *         culprit:
 *           type: string
 *           description: Causa principal del error
 *         error_type:
 *           type: string
 *           enum: ['error', 'warning', 'info']
 *           description: Tipo de error
 *         environment:
 *           type: string
 *           enum: ['testing', 'development', 'production']
 *           description: Entorno de ejecución
 *         status:
 *           type: string
 *           enum: ['unresolved', 'in review', 'solved']
 *           description: Estado del log
 *         priority:
 *           type: string
 *           enum: ['low', 'medium', 'high', 'critical']
 *           description: Nivel de prioridad del log
 *         assigned_to:
 *           type: string
 *           description: Usuario asignado para resolver el log
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se creó el log
 *         last_seen_at:
 *           type: string
 *           format: date-time
 *           description: Última vez que se detectó este incidente (trazabilidad)
 *         count:
 *           type: integer
 *           description: Número de veces que ha ocurrido este incidente (trazabilidad)
 *         active:
 *           type: boolean
 *           description: Indica si el log está activo (para borrado lógico)
 *         hash:
 *           type: string
 *           description: Identificador único generado por culprit, error_type, y environment
 *         json_sentry:
 *           type: object
 *           description: Payload completo de Sentry
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Obtener todos los logs (con filtros y paginación)
 *     tags: [Logs]
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
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por múltiples campos
 *       - in: query
 *         name: issue_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de incidente
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         description: Filtrar por mensaje de log
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: ['testing', 'development', 'production']
 *         description: Entorno de ejecución
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['unresolved', 'in review', 'solved']
 *         description: Estado del log
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: ['low', 'medium', 'high', 'critical']
 *         description: Prioridad del log
 *       - in: query
 *         name: assigned_to
 *         schema:
 *           type: string
 *         description: Usuario asignado
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por logs activos/inactivos
 *       - in: query
 *         name: hash
 *         schema:
 *           type: string
 *         description: Identificador único generado por culprit, error_type, y environment
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Filtrar logs creados después de esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Filtrar logs creados antes de esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: last_seen_at
 *         description: "Campo por el cual ordenar [ej: created_at, last_seen_at]"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de clasificación (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
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
 *                     $ref: '#/components/schemas/Log'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Obtener un log por ID
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
 *         description: Log found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       404:
 *         description: Log not found
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
 *         description: Log created successfully
 *       400:
 *         description: Invalid data
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
 *         description: Log updated successfully
 *       404:
 *         description: Log not found
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
 *         description: Log deleted successfully
 *       404:
 *         description: Log not found
 */
