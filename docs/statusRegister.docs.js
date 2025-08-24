/**
 * @swagger
 * tags:
 *   name: StatusRegister
 *   description: Endpoints para gestión del historial de cambios de estado de los logs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusRegister:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del registro de estado
 *         status:
 *           type: string
 *           enum: [unresolved, in review, solved]
 *           description: Estado asignado al log
 *           example: "in review"
 *         userId:
 *           type: string
 *           description: ID del usuario que realizó el cambio
 *         logId:
 *           type: string
 *           description: ID del log afectado
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha en que se realizó el cambio
 *
 *     StatusRegisterInput:
 *       type: object
 *       required:
 *         - logId
 *         - status
 *       properties:
 *         logId:
 *           type: string
 *           description: ID del log al que se actualiza el estado
 *           example: "64a9f2c2e1a9b3f5a7d12345"
 *         status:
 *           type: string
 *           enum: [unresolved, in review, solved]
 *           description: Nuevo estado a asignar al log
 *           example: "in review"
 */

/**
 * @swagger
 * /status-register:
 *   post:
 *     summary: Cambiar el estado de un log y registrar el cambio
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusRegisterInput'
 *     responses:
 *       200:
 *         description: Log status updated and change registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log status updated and change registered successfully."
 *                 log:
 *                   $ref: '#/components/schemas/Log'
 *                 statusRegister:
 *                   $ref: '#/components/schemas/StatusRegister'
 *       400:
 *         description: Invalid data in the request
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Obtener todos los registros de cambios de estado
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Número de registros por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Orden de clasificación (ascendente o descendente)
 *     responses:
 *       200:
 *         description: List of status records obtained successfully
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
 *                   example: 5
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StatusRegister'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /status-register/{id}:
 *   get:
 *     summary: Obtener un registro de cambio de estado por ID
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de estado a obtener
 *     responses:
 *       200:
 *         description: Status record obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusRegister'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Status record not found
 *       500:
 *         description: Server error
 */
