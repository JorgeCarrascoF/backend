/**
 * @swagger
 * tags:
 *   name: Suggestions
 *   description: Endpoints para la generación y gestión de sugerencias basadas en logs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Suggestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la sugerencia
 *         idLog:
 *           type: string
 *           description: ID del log asociado
 *         report:
 *           type: object
 *           description: Reporte generado por el motor de sugerencias
 *           properties:
 *             summary:
 *               type: string
 *               description: Resumen del análisis
 *             details:
 *               type: string
 *               description: Detalles del reporte
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la sugerencia
 *     SuggestionInput:
 *       type: object
 *       required:
 *         - id
 *         - owner
 *         - repo
 *       properties:
 *         id:
 *           type: string
 *           description: ID del log a procesar
 *           example: "64f1c2d9a2f3d6e1a8f7b9c0"
 *         owner:
 *           type: string
 *           description: Propietario del repositorio
 *           example: "octocat"
 *         repo:
 *           type: string
 *           description: Nombre del repositorio
 *           example: "hello-world"
 *         branch:
 *           type: string
 *           description: Rama del repositorio (por defecto `main`)
 *           example: "develop"
 */

/**
 * @swagger
 * /suggestions:
 *   post:
 *     summary: Generar un reporte de sugerencias a partir de un log
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuggestionInput'
 *     responses:
 *       200:
 *         description: Sugerencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Suggestion created successfully"
 *                 report:
 *                   $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Log no encontrado
 *       500:
 *         description: Error al generar el reporte
 */

/**
 * @swagger
 * /suggestions/log/{logId}:
 *   get:
 *     summary: Obtener reportes de sugerencias asociados a un log
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del log asociado
 *     responses:
 *       200:
 *         description: Lista de sugerencias del log solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Log no encontrado o sin sugerencias
 *       500:
 *         description: Error en el servidor
 */
