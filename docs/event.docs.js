/**
 * //@swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - issue_id
 *         - short_id
 *         - title
 *         - created_at
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del Event
 *         issue_id:
 *           type: string
 *           description: ID del issue relacionado
 *         short_id:
 *           type: string
 *           description: ID corto del evento
 *         title:
 *           type: string
 *           description: Título del evento
 *         level:
 *           type: string
 *           description: Nivel de severidad
 *         project_id:
 *           type: string
 *           description: ID del proyecto asociado
 *         status:
 *           type: string
 *           description: Estado del evento
 *         count:
 *           type: integer
 *           description: Cantidad de ocurrencias del evento
 *         user_count:
 *           type: integer
 *           description: Cantidad de usuarios afectados
 *         is_unhandled:
 *           type: boolean
 *           description: Indica si el evento no fue manejado
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del evento
 *         update_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de última actualización
 */

/**
 * //@swagger
 * /events:
 *   get:
 *     summary: Obtener todos los Eventos (con filtros y paginación)
 *     tags: [Events]
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
 *         name: project_id
 *         schema:
 *           type: string
 *         description: ID del proyecto asociado
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Estado del evento
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Nivel de severidad
 *     responses:
 *       200:
 *         description: Lista de Events obtenida correctamente
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
 *                     $ref: '#/components/schemas/Event'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */

/**
 * //@swagger
 * /events/{id}:
 *   get:
 *     summary: Obtener un Evento por ID
 *     tags: [Events]
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
 *         description: Event encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event no encontrado
 */

/**
 * //@swagger
 * /events:
 *   post:
 *     summary: Crear un nuevo Evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * //@swagger
 * /events/{id}:
 *   patch:
 *     summary: Actualizar un Evento existente
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event actualizado
 *       404:
 *         description: Event no encontrado
 */

/**
 * //@swagger
 * /events/{id}:
 *   delete:
 *     summary: Eliminar un Evento
 *     tags: [Events]
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
 *         description: Event eliminado
 *       404:
 *         description: Event no encontrado
 */
