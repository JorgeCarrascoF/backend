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
 *         description: Log actualizado y cambio de estado registrado
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
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Log no encontrado
 *       500:
 *         description: Error en el servidor
 */
