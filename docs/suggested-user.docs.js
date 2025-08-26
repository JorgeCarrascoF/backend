/**
 * @swagger
 * tags:
 *   name: Suggested-user
 *   description: Endpoints para sugerencias de responsables en base a históricos de resolución
 */

/**
 * @swagger
 * /suggested-user/{error_signature}:
 *   get:
 *     summary: Obtener sugerencias de usuarios responsables para un tipo de error
 *     tags: [Suggested-user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: error_signature
 *         required: true
 *         schema:
 *           type: string
 *         description: Firma del error (error_signature)
 *     responses:
 *       200:
 *         description: List of suggested users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error_signature:
 *                   type: string
 *                   example: "DB_CONNECTION_ERROR"
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "64b1f2a8c1234abcd56789ef"
 *                       name:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "buggle@example.com"
 *                       role:
 *                         type: string
 *                         example: "developer"
 *                       resolved_count:
 *                         type: number
 *                         example: 10
 *                       last_resolved_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-10T20:00:30.789Z"
 *       400:
 *         description: The error_signature parameter is missing
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
