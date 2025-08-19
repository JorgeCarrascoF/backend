/**
 * @swagger
 * /webhook/sentry:
 *   post:
 *     summary: Recibe eventos de error desde Sentry (webhook)
 *     description: Endpoint que procesa automáticamente eventos enviados por Sentry y los guarda como Logs.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   event:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: string
 *                       issue_id:
 *                         type: string
 *                       short_id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       level:
 *                         type: string
 *                       web_url:
 *                         type: string
 *                       culprit:
 *                         type: string
 *                       location:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         properties:
 *                           function:
 *                             type: string
 *                       type:
 *                         type: string
 *                       environment:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           ip_address:
 *                             type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *     responses:
 *       201:
 *         description: Log created from Sentry webhook
 *       400:
 *         description: Missing data in payload
 *       500:
 *         description: Server error
 */